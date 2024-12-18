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
	LOGOUT = 0x34
}

export default class EzWs {
	private readonly PORT: number;
	private socket: WebSocket | null = null;
	private requests: Map<uint10, WsHandler>;
	private handle: (packet: DeserializedPacket) => void;
	private setConnected: (connected: boolean) => void;
	private reconnectTimeout: NodeJS.Timeout | null = null;

	constructor(
		port: number, 
		handleUnregisteredMessage: (msg: DeserializedPacket) => void,
		setConnected: (connected: boolean) => void
	) {
		this.requests = new Map();
		this.PORT = port;
		this.handle = handleUnregisteredMessage;
		this.setConnected = setConnected;
	}

	public isConnected = (): boolean => {
		return this.socket !== null && this.socket !== undefined && this.socket.readyState === WebSocket.OPEN;
	}

	public connect = (): EzWs => {
		try {
			console.log(`[${this.constructor.name}] Attempting to connect to ws://localhost:${this.PORT}`);
			this.socket = new WebSocket(`ws://localhost:${this.PORT}`, undefined);
		} catch (e: any) {
			this.setConnected(false);
			this.scheduleReconnect();
			throw(new Error(`[${this.constructor.name}] Error creating websocket connection: ${e.message}`));
		}

		if (!this.socket) {
			throw new Error(`[${this.constructor.name}] Error creating websocket connection - failed to create WebSocket`);
		}

		this.socket.on("open", this.handleOpen);
		this.socket.on("close", this.handleClose);
		this.socket.on("message", this.handleMessage);
		this.socket.on("error", this.handleError);

		return this;
	}

	public reconnect = () => {
		this.close();
		setTimeout(() => this.connect(), 2000);
	}

	private scheduleReconnect = () => {
		if(this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}

		this.reconnectTimeout = setTimeout(() => {
			this.connect();
		}, this.reconnectTimeout ? 2 * 2000 : 2000);
	}

	private handleMessage = (data: Buffer) => {
		// deserialize the message
		let deserializedMsg: DeserializedPacket;
		try {
			deserializedMsg = EzSerDe.deserialize(data);
		} catch (e) {
			console.error(`[${this.constructor.name}] Error deserializing message:`, e);
			return;
		}

		// print the message for debug
		this.printMessage(deserializedMsg);

		// check if the message is a response to an existing request
		const handler = this.requests.get(deserializedMsg.id);
		if (handler) {
			// resolve the message and remove the request from the map
			handler.resolve(deserializedMsg.payload.toString());
			this.requests.delete(deserializedMsg.id);
		} else {
			this.handle(deserializedMsg);
		}
	}

	private printMessage = (msg: DeserializedPacket) => {
		const deserializedMsgPayload: string = msg.payload.toString();
		console.log(`[${this.constructor.name}] Received 0x${msg.flag.toString(16)} ${EzFlag[msg.flag]}: ${deserializedMsgPayload.substring(0, 32)}${deserializedMsgPayload.length>32 ? "..." : ""}`);
	}

	public send = (routeFlag: EzFlag, data?: string | Buffer, id?: number): void => {
		if (!this.isConnected() || !this.socket) {
			throw(new Error(`[${this.constructor.name}] Not connected`));
		}
		
		let payload: Buffer;
		if(data) {
			payload = (typeof data === "string") ? Buffer.from(data) : data;
		} else {
			payload = Buffer.alloc(0);
		}

		const serializedMsg = EzSerDe.serialize(routeFlag, payload, id);
		this.socket.send(serializedMsg);
	}

	public ask = async(routeFlag: EzFlag, data?: string | Buffer): Promise<string | undefined> => {
		if (!this.isConnected()) {
			throw(new Error(`[${this.constructor.name}] Not connected`));
		}

		// create a unique id for this request, limiting it to 10 bits
		let id: number = 0;
		do {
			id = Math.floor(Math.random() * 0x3FF);
		} while (this.requests.has(id));

		const promisedResult = new Promise<string>((resolve, reject) => {
			// add the request to the map and send the request with data if it exists
			this.requests.set(id, { resolve, reject } as WsHandler);
			this.send(routeFlag, data, id);
			
			// timeout the request
			setTimeout(() => {
				if (!this.requests.has(id)) return;
				reject(`[${this.constructor.name}] Request timed out`);
				this.requests.delete(id);
			}, 5000);
		});

		return promisedResult;
	}

	private handleOpen = () => {
		console.log(`[${this.constructor.name}] Connection opened`);
		this.setConnected(true);
	}

	private handleClose = () => {
		console.log(`[${this.constructor.name}] Connection closed`);
		this.setConnected(false);
		this.scheduleReconnect();
	}

	public close(reconnect: boolean = true, force: boolean = false): void {
		if(this.socket === null || !this.isConnected()) {
			if(!force) {
				throw(new Error(`[${this.constructor.name}] Not connected`));
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

	public dispose = () => {
		this.close(false, true);
	}
}