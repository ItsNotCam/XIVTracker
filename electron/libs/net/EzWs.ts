import EzSerDe from "./EzSerDe";
import WebSocket from 'ws';

type WsHandler = {
	resolve: (result: any) => void;
	reject: (reason?: any) => void;
}

export enum EzFlag {
	NULL = 0x01,
	HEARTBEAT = 0x02,
	EZ = 0x1D,
	ECHO = 0x3FF,

	OK = 0x03,
	MALFORMED = 0x04,
	NOT_IMPLEMENTED = 0x05,
	NOT_FOUND = 0x06,
	INTERNAL_ERROR = 0x07,
	NOT_AVAILABLE = 0x08,
	TOO_MANY_REQUESTS = 0x09,

	LOCATION_ALL = 0x10,
	LOCATION_POSITION = 0x11,
	LOCATION_ROTATION = 0x12,
	LOCATION_AREA = 0x13,
	LOCATION_TERRITORY = 0x14,
	LOCATION_REGION = 0x15,
	LOCATION_SUB_AREA = 0x16,
	
	JOB_ALL = 0x20,
	JOB_MAIN = 0x21,
	JOB_CURRENT = 0x22,

	TIME = 0x30,
	NAME = 0x31,
	CURRENCY = 0x32,
	LOGIN = 0x33,
	LOGOUT = 0x33
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
			console.log(`Attempting to connect to ws://localhost: ${this.PORT}`);
			this.socket = new WebSocket(`ws://localhost:${this.PORT}`, undefined);
		} catch (e: any) {
			this.setConnected(false);
			this.scheduleReconnect();
			throw(new Error("Error creating websocket connection: " + e.message));
		}

		if (!this.socket) {
			throw new Error("Error creating websocket connection - failed to create WebSocket");
		}

		this.socket.on("open", this.handleOpen);
		this.socket.on("close", this.handleClose);
		this.socket.on("message", this.handleMessage);
		this.socket.on("error", this.handleError);

		return this;
	}

	private scheduleReconnect() {
		if(this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}

		this.reconnectTimeout = setTimeout(() => {
			this.connect();
		}, this.reconnectTimeout ? 2 * 2000 : 2000);
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
			// console.log("Unregistered message:", JSON.stringify({
			// 	flag: EzFlag[deserializedMsg.flag],
			// 	payload: deserializedMsg.payload.toString()
			// }, null, 2));
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
		if(this.socket === null || this.socket === undefined || this.socket.readyState === undefined) {
			return false;
		}

		return this.socket.readyState === WebSocket.OPEN;
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

	private handleOpen = (socket: WebSocket) => {
		console.log("Connection opened");

		this.setConnected(true);
	}

	private handleClose = () => {
		console.log("Connection closed");
		this.setConnected(false);
		this.scheduleReconnect();
	}
}