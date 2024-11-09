import net from 'net';
import {v4} from 'uuid';
import { ezDeserialize, ezSerialize } from './ez-proto/ezproto';

interface TcpResponse {
	resolve: (value: Buffer) => void;
	reject: (reason?: any) => void;
}

// Request structure:
// UUID (or nothing)
// route
// payload ...

const HOST = process.env.HOST_IN || 'localhost';
const PORT_OUT = parseInt(process.env.TCP_OUT || '58008');
export default class EzTcpClient {
	public client!: net.Socket | undefined;
	public isReconnecting: boolean = false;

	private drained: boolean = true;
	private requestsAwaitingResponse!: Map<string,TcpResponse>;
	private setConnected = (connected: boolean): void => { console.log(connected); };

	constructor(handle: (msg: Buffer) => void, setConnected: (connected: boolean) => void) {
		this.connect(handle);
		this.setConnected = setConnected;

		this.requestsAwaitingResponse = new Map<string, TcpResponse>();
	}

	public isConnected(): boolean { 
		return !this.client?.closed;
	};

	private connect(handle: (msg: Buffer) => void) {
		console.log(`Attempting to connect to ${HOST}:${PORT_OUT}`);
		this.client = net.createConnection(PORT_OUT, HOST, () => {
				console.log('TCP client connected to ' + HOST + ':' + PORT_OUT);
				this.isReconnecting = false;
				this.setConnected(true);
		});
		
		this.client.on("data", (data: Buffer) => {
			let id: string = "";
			let message: Buffer;

			try {
				const result = ezDeserialize(data);
				id = result.id;
				message = Buffer.from(result.data);
			} catch(e) {
				console.log(e);
				return;
			}

			if(this.requestsAwaitingResponse.has(id)) {
				const request = this.requestsAwaitingResponse.get(id)!;
				request.resolve(message);
				this.requestsAwaitingResponse.delete(id);
				return;
			}

			handle(data);
		});

		this.client.on("drain", () => {
			console.log("drained");
		})

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

	public async sendMessage(data: Buffer): Promise<void> {
		if(!this.drained) {
			console.log("data sending in progress")
			return;
		}

		this.drained = false;
		try {
			await this.write(data);
		} finally {
			this.drained = true;
		}
	}

	public async write(data: Buffer): Promise<void> {
		return new Promise((resolve, reject) => {
			this.client?.write(data, (err: Error | undefined) => {
				if(err) {
					console.log("error sending message:", err)
					reject(err);
				} else {
					resolve();
				}
			})
		})
	}

	public async sendAndAwaitResponse(data: Buffer, timeoutMs = 1000): Promise<Buffer> {
		if(!this.isConnected()) {
			throw(new Error("not connected"))
		}

		const id = v4().substring(0,8);

		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				this.requestsAwaitingResponse.delete(id);
				reject(new Error("Request timed out"));
			}, timeoutMs)

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

			const outData = ezSerialize(data, id);
			this.sendMessage(outData).catch(reject);
		});
	}

	public close(): void {
		this.client?.end(() => {
			try { this.setConnected(false); }
			catch { console.log("failed to set connected to false lol") }
		});
	}
}
