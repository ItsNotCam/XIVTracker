import net from 'net';
import EzSerDe from './ez/EzSerDe';
import {
	DeserializedPacket,
	EzFlag,
	uint6
} from './ez/EzTypes.d';
import { EzPacketStream } from './ez/EzPacketStream';

interface TcpHandler {
	resolve: (value: Buffer) => void;
	reject: (reason?: any) => void;
}

const HOST = process.env.HOST_IN || 'localhost';
const PORT_OUT = parseInt(process.env.TCP_OUT || '58008');

export default class EzTcpClient {
	private isReconnecting: boolean = false;
	private client!: net.Socket | undefined;
	private heartbeat: NodeJS.Timeout | undefined;
	private requestsAwaitingResponse!: Map<uint6, TcpHandler>;
	private PacketStream: EzPacketStream;

	private setConnected = (connected: boolean): void => {
		new Error("Not implemented")
	};


	constructor(handle: (msg: Buffer) => void, setConnected: (connected: boolean) => void) {
		this.connect(handle);
		this.setConnected = setConnected;

		this.requestsAwaitingResponse = new Map<uint6, TcpHandler>();
		this.PacketStream = new EzPacketStream();
	}

	public isConnected(): boolean {
		return !this.client!.closed;
		// return this.connectionIsIntact;
	}

	public stopHeartbeat = () => {
		clearInterval(this.heartbeat);
		this.heartbeat = undefined;
	}

	public startHeartbeat = async () => {
		if (this.heartbeat !== undefined) {
			return;
		}

		this.heartbeat = setInterval(async () => {
			const message: Buffer = Buffer.from("you sleep?");
			const response: Buffer = await this.sendAndAwaitResponse(EzFlag.HEARTBEAT, message);

			try {
				const deserialized: DeserializedPacket = EzSerDe.deserialize(response);
				if (deserialized.payload === message) {
					console.log("still connected");
				} else {
					throw new Error("Heartbeat response malformed. Expected 'you sleep?' but got " + deserialized.payload.toString());
				}
			} catch (e) {
				console.log("Heartbeat failed:", (e as any).message);
			}
		}, 5000);
	}

	// TODO: handle malformed and invalid packets gracefully, only fully processing data when
	// the packet is completely received
	private connect(handle: (msg: Buffer) => void) {
		console.log(`Attempting to connect to ${HOST}:${PORT_OUT}`);
		this.client = net.createConnection(PORT_OUT, HOST, () => {
			console.log('TCP client connected to ' + HOST + ':' + PORT_OUT);
			this.isReconnecting = false;
			this.setConnected(true);
		});

		this.client.on("data", (data: Buffer) => {
			this.handleData(data, handle);
		});

		this.client.on("close", () => {
			console.log('TCP client closed');
			try { this.setConnected(false); }
			catch { console.log("failed to set connected to false lol") }
			this.scheduleReconnect(handle);
		});

		this.client.on("error", (err) => {
			if (err.message === 'ECONNREFUSED') {
				console.log('Connection refused - server might be down, retrying...');
				if (!this.isReconnecting) {
					this.scheduleReconnect(handle);
				}
			} else {
				console.log('TCP client error:', err.name);
			}
		});
	}

	private scheduleReconnect(handle: (msg: Buffer) => void) {
		this.isReconnecting = true;
		setTimeout(() => {
			this.connect(handle);
			this.isReconnecting = false;
		}, 1000);
	}

	public async fireAndForget(data: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			try {
				this.write(data);
				resolve()
			} catch {
				reject()
			}
		})
	}

	private async write(data: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client?.write(data, (err: Error | undefined) => {
				if (err) {
					console.log("error sending message:", err)
					reject(err);
				} else {
					resolve();
				}
			})
		})
	}

	public async getData(routeFlag: uint6, timeoutMs: number = 1000) {
		return await this.sendAndAwaitResponse(routeFlag, Buffer.from([EzFlag.NULL]), timeoutMs);
	}

	public async sendAndAwaitResponse(
		routeFlag: uint6,
		data: Buffer = Buffer.from([EzFlag.NULL]),
		timeoutMs: number = 1000
	): Promise<Buffer> {
		// get a new 10 bit ID - continuously generate until it's unique
		let id: number = 0;
		do { id = Math.floor(Math.random() * 0x3FF); }
		while (this.requestsAwaitingResponse.has(id));

		// this is wierd lol
		return new Promise((resolve, reject) => {
			// create a request timeout
			const timeout = setTimeout(() => {
				this.requestsAwaitingResponse.delete(id);
				reject(new Error("Request timed out"));
			}, timeoutMs)

			// setup the promise that handles this message
			this.requestsAwaitingResponse.set(id, {
				resolve: (response: Buffer) => {
					clearTimeout(timeout);
					resolve(response);
				},
				reject: (err: Error) => {
					clearTimeout(timeout);
					reject(err);
				}
			})

			console.log(routeFlag, data, id);
			const outData = EzSerDe.serialize(routeFlag, data, id);
			this.fireAndForget(outData).catch(reject);
		});
	}

	public close(): void {
		this.client?.end(() => {
			try {
				this.PacketStream.flush();
				this.stopHeartbeat();
				this.setConnected(false);
			} catch {
				console.log("failed to set connected to false lol")
			}
		});
	}

	private handleData(data: Buffer, handle: (data: Buffer) => void): void{
		try {
			this.PacketStream.appendData(data);
		} catch (e) {
			console.log("Error handling data:", (e as any).message);
			return;
		}
		if(this.PacketStream.isFull()) {
			const flushedData = this.PacketStream.flush();
			if(flushedData === null) {
				return;
			}

			const deserializedData = EzSerDe.deserialize(flushedData);
			if(!this.requestsAwaitingResponse.has(deserializedData.id)) {
				return;
			}

			const request = this.requestsAwaitingResponse.get(deserializedData.id)!;
			request.resolve(deserializedData.payload);
			this.requestsAwaitingResponse.delete(deserializedData.id);
		} else {
			console.log("not full yet");
			return;
		}
	}
}