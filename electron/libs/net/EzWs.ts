import EzSerDe from "./EzSerDe";
import WebSocket from 'ws';

type WsHandler = {
	resolve: (result: any) => void;
	reject: (reason?: any) => void;
}

export default class EzWs {
	private readonly PORT: number;
	private socket: WebSocket | null = null;
	private requests: Map<uint6, WsHandler>;
	private handle: (packet: DeserializedPacket) => void;
	private setConnected: (connected: boolean) => void;
	private reconnectTimeout: NodeJS.Timeout | null = null;

	constructor(port: number, handleUnregisteredMessage: (msg: DeserializedPacket) => void, setConnected: (connected: boolean) => void) {
		this.requests = new Map();
		this.PORT = port;
		this.handle = handleUnregisteredMessage;
		this.setConnected = setConnected;
	}

	public connect = (): EzWs => {
		try {
			this.socket = new WebSocket(`ws://localhost:${this.PORT}`);
		} catch (e: any) {
			this.setConnected(false);
			this.scheduleReconnect();
			throw(new Error("Error creating websocket connection: " + e.message));
		}

		if (!this.socket) {
			throw new Error("Error creating websocket connection - failed to create WebSocket");
		}

		this.socket.on("message", this.handleMessage);
		this.socket.on("open", this.handleOpen);
		this.socket.on("error", this.handleError);
		this.socket.on("close", this.handleClose);

		return this;
	}

	private scheduleReconnect() {
		if(this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}

		this.reconnectTimeout = setTimeout(() => {
			this.connect();
		}, 2000);
	}

	public reconnect() {
		this.close();
		this.connect();
	}

	private handleMessage = (data: Buffer) => {
		let deserializedMsg: DeserializedPacket;
		try {
			deserializedMsg = EzSerDe.deserialize(data);
		} catch (e) {
			console.error("Error deserializing message:", e);
			return;
		}

		console.log(`Received ${EzFlag[deserializedMsg.flag]}: ${deserializedMsg.payload.toString()}`);
		if (this.requests.has(deserializedMsg.id)) {
			const handler: WsHandler = this.requests.get(deserializedMsg.id)!;
			handler.resolve(deserializedMsg.payload.toString());
			this.requests.delete(deserializedMsg.id);
		} else {
			this.handle(deserializedMsg);
		}
	}

	public send(routeFlag: EzFlag, data: string | Buffer, id?: number): void {
		if (!this.isConnected()) {
			throw(new Error("Not connected"));
		}
		const payload = (typeof data === "string") ? Buffer.from(data) : data;
		const serializedMsg = EzSerDe.serialize(routeFlag, payload, id);
		this.socket!.send(serializedMsg);
	}

	public async ask(routeFlag: EzFlag, data?: string | Buffer): Promise<string | undefined> {
		if (!this.isConnected()) {
			throw(new Error("Not connected"));
		}

		let id: number = 0;
		do {
			id = Math.floor(Math.random() * 0x3FF);
		} while (this.requests.has(id));

		return new Promise<string>((resolve, reject) => {
			const timeout = setTimeout(() => {
				if (!this.requests.has(id))
					return;

				this.requests.delete(id);
				reject("Request timed out");
			}, 5000);

			this.requests.set(id, {
				resolve: (result: any) => {
					clearTimeout(timeout);
					resolve(result);
				},
				reject: (reason?: any) => {
					clearTimeout(timeout);
					reject(reason);
				}
			});

			data = data || Buffer.alloc(0);
			this.send(routeFlag, data, id);
		});
	}

	public isConnected = (): boolean => {
		if(this.socket === null) {
			return false;
		}

		if(this.socket.readyState !== WebSocket.OPEN) {
			return false;
		}
		
		return true;
	};

	public close = (reconnect: boolean = true, force: boolean = false): void => {
		if(this.socket === null || !this.isConnected()) {
			if(!force) {
				throw(new Error("Not connected"));
			}
		}

		this.socket!.close()
		if(reconnect) {
			this.scheduleReconnect();
		}
	};

	private handleError = () => {
		if (!this.isConnected()) {
			this.scheduleReconnect();
		}
	}

	private handleOpen = () => {
		console.log("Connection opened");
		this.setConnected(true);
	}

	private handleClose = () => {
		console.log("Connection closed");
		this.scheduleReconnect();
	}
}