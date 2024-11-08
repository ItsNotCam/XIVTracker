import net from 'net';
import { uuid } from 'uuidv4';

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
			const dataStr: string = data.toString();
			const route: string = dataStr.split("\n")[0]
			if(this.requestsAwaitingResponse.has(route)) {
				const request: TcpResponse = this.requestsAwaitingResponse.get(route)!;
				const finalData: Buffer = Buffer.from(dataStr.split("\n").slice(1).join("\n"));
				request.resolve(finalData);
				this.requestsAwaitingResponse.delete(route);
				return;
			}

			handle(data);
		});

		this.client.on("drain", () => {
			console.log("drained");
		})

		this.client.on("close", () => {
			console.log('TCP client closed');
			this.setConnected(false);
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

	public async sendAndAwaitResponse(data: Buffer, timeoutMs = 5000): Promise<Buffer> {
		if(!this.isConnected()) {
			throw(new Error("not connected"))
		}

		const id = uuid();

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

			// ez      -> 29 	  | 1  bytes | 8 bits
			// length  -> ...   | 2  bytes | 16 bits
			// id			 -> ...   | 8  bytes | 64 bits  | uuid.v4().substring(0,8)
			// payload -> ...   | 64 bytes | 512 bits | payload
			// ez			 -> 29		| 1  byte  | 8 bits

			let uu = Buffer.alloc(2)
			uu.writeUint16BE(Math.min(data.length, 64))

			// console.log("ID", id.substring(0,8));
			const outData: Buffer = Buffer.from([
				0x1D,
				...uu,
				...Buffer.from(id.substring(0,8)),
				...data,
				0x1D
			])

			// const outData = Buffer.concat([
			// 	0x1D, 
			// 	Buffer.from("ez\n"),
			// 	Buffer.from(data.length.toString()),
			// 	Buffer.from(`\n${id}\n`),
			// 	Buffer.from(`${data}\n`),
			// 	Buffer.from(`pz\n`),
			// ]);

			this.sendMessage(outData).catch(reject);
		});
	}

	public close(): void {
		this.client?.end(() => {
			this.setConnected(false);
		});
	}
}
