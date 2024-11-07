import net from 'net';

const HOST = process.env.HOST_IN || 'localhost';
const PORT_OUT = parseInt(process.env.TCP_OUT || '58008');
export default class EzTcpClient {
	public client: net.Socket | undefined;
	public drained: boolean = true;
	public isReconnecting: boolean = false;

	private setConnected = (connected: boolean): void => { console.log(connected); };

	constructor(handle: (msg: Buffer) => void, setConnected: (connected: boolean) => void) {
		this.connect(handle);
		this.setConnected = setConnected;
	}

	public isConnected(): boolean { 
		return !this.client?.closed 
	};

	private connect(handle: (msg: Buffer) => void) {
		console.log(`Attempting to connect to ${HOST}:${PORT_OUT}`);
		this.client = net.createConnection(PORT_OUT, HOST, () => {
				console.log('TCP client connected to ' + HOST + ':' + PORT_OUT);
				this.isReconnecting = false;
				this.setConnected(true);
		});
		
		this.client.on("data", (data: Buffer) => {
			this.drained = false;
			handle(data);
		});

		this.client.on("close", () => {
			console.log('TCP client closed');
			this.setConnected(false);
			this.scheduleReconnect(handle);
		});

		this.client.on("drain", () => {
			this.drained = true;
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

			this.setConnected(!this.client?.closed);
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
		return new Promise((resolve, reject) => {
			let interval = setInterval(() => {
				if(this.drained) {
					clearInterval(interval);
					this.client?.write(data, (err) => {
						if(err) {
							console.log('TCP client write error: ' + err);
							reject(err);
						} else {
							resolve();
						}
					});
				}
			}, 10);
		});
	}

	public async sendAndAwaitResponse(data: Buffer): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const sent = this.client?.write(data, (err) => {
				if(err) {
					console.log('TCP client write error: ' + err);
					reject(err);
				}
			})

			if(!sent) {
				reject('TCP client write failed');
			} else {
				this.client?.once('data', (data: Buffer) => {
					resolve(data);
				});
			}
		})
	}

	public close() {
		this.client?.end(() => {
			console.log('TCP client ended');
			this.setConnected(false);
		});
	}
}