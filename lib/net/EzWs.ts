import EzSerDe from "./ez/EzSerDe";
import { DeserializedPacket, EzFlag, uint6 } from "./ez/EzTypes";

import WebSocket from 'ws';
import { BrowserWindow } from 'electron';

type WsHandler = {
	resolve: (result: any) => void;
	reject: (reason?: any) => void;
}

export default class EzWs {
	private socket: WebSocket | null = null;
	private requests: Map<uint6,WsHandler>;
	private handle: (packet: DeserializedPacket) => void;
	private setConnected: (connected: boolean) => void;
	private reconnectTimeout: NodeJS.Timeout | null = null;

	constructor(handle: (msg: DeserializedPacket) => void, setConnected: (connected: boolean) => void) {
		this.requests = new Map();
		this.handle = handle;
		this.setConnected = setConnected;
		this.initSocket();
	}

	private initSocket = () => {
		try {
			this.socket = new WebSocket('ws://localhost:50085');
		} catch(e) {
			console.error("Error creating websocket connection:", e);
			this.scheduleReconnect();
			return;
		}

		if(!this.socket) {
			throw new Error("Error creating websocket connection - failed to create WebSocket");
		}

		this.socket.on("message", this.handleMessage);
		this.socket.on("open"		, this.handleOpen);
		this.socket.on("error"	, this.handleError);
		this.socket.on("close"	, this.handleClose);
	}

	private scheduleReconnect() {
		if(this.reconnectTimeout) {
			clearTimeout(this.reconnectTimeout);
		}

		this.reconnectTimeout = setTimeout(this.initSocket,1000);
	}	

	private handleMessage = (data: Buffer) => {
		console.log("received:", data);
		let decodedMessage: DeserializedPacket;
		try {
			decodedMessage = EzSerDe.deserialize(data);
		} catch(e) {
			console.error("Error deserializing message:", e);
			return;
		}
		console.log("decoded:", decodedMessage.id, decodedMessage.flag, decodedMessage.payload);

		if(this.requests.has(decodedMessage.id)) {
			console.log("resolving:", decodedMessage.id);
			const handler: WsHandler = this.requests.get(decodedMessage.id)!;
			handler.resolve(decodedMessage.payload.toString());
			this.requests.delete(decodedMessage.id);
		} else {
			this.handle(decodedMessage);
		}
	}

	public send(routeFlag: EzFlag, data: string | Buffer, id?: number): void {
		if(!this.isConnected()) {
			console.error("Error sending message - not connected");
			return;
		}

		const payload = (typeof data === "string") ? Buffer.from(data) : data;
		const encodedMessage = EzSerDe.serialize(routeFlag, payload, id);
		this.socket!.send(encodedMessage);
	}

	public async sendAndAwaitResponse(routeFlag: EzFlag, data?: string | Buffer): Promise<string | undefined> {
		if(!this.isConnected()) {
			console.error("Error sending message - not connected");
			return undefined;
		}

		let id: number = 0;
		do { 
			id = Math.floor(Math.random() * 0x3FF); 
		} while(this.requests.has(id));

		console.log("sending:", id, routeFlag, data);
		return new Promise<string>((resolve, reject) => {
			const timeout = setTimeout(() => {
				if(!this.requests.has(id))
					return;

				this.requests.delete(id);
				reject("Request timed out");
			}, 5000);

			this.requests.set(id, {
				resolve: (result: any) => {
					clearTimeout(timeout);
					resolve(result);
				}, reject: (reason?: any) => {
					clearTimeout(timeout);
					reject(reason);
				}
			});

			data = data || Buffer.alloc(0);
			this.send(routeFlag, data, id);
		});
	}

	public isConnected = (): boolean => this.socket !== null && this.socket.readyState === WebSocket.OPEN;

	public close = (): void => {
		if(this.isConnected()) {
			this.socket!.close()
		}
		this.setConnected(false);
	};

	private handleError = (ev: any) => {
		console.error("WebSocket error:", ev.code);
		if(!this.isConnected()) {
			this.scheduleReconnect();
		}
	}

	private handleOpen = () => {
		console.log("WebSocket opened");
		this.setConnected(true);
	}

	private handleClose = (ev: CloseEvent) => {
		console.log("WebSocket closed:", ev);
		this.setConnected(false);
		this.scheduleReconnect();
	}
}