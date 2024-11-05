import { TCPClient, ClientInterface, TCPServer} from "pocket-sockets";

const HOST = process.env.HOST_IN || 'localhost';

// server handles incoming messages
const PORT_IN = parseInt(process.env.TCP_IN || '42069');
export class EzTcpServer {
	private server: TCPServer;
	public hasConnection: boolean = false;

	constructor(handle: (msg: Buffer) => void) {
		this.server = new TCPServer({
			host: HOST,
			port: PORT_IN,
			textMode: false
		});
	
		this.server.onConnection( (client: ClientInterface) => {
			console.log(`TCP connection received from ${HOST}:${PORT_IN}`);
			this.hasConnection = true;

			async () => {
				client.onData( (data: Buffer | string) => {
						console.log('TCP Server received data ' + data);
						handle(data as Buffer);
				});
				client.onClose( () => {
					console.log('TCP Server closing');
					this.hasConnection = false;
				});
			}
		});

		this.server.listen();
		console.log(`TCP Server listening on ${HOST}:${PORT_IN} ? ${this.server.isClosed()}`);
	}

	public close() {
		this.server.close();
	}
}

const PORT_OUT = parseInt(process.env.TCP_OUT || '42070');
export class EzTcpClient {
	private client: TCPClient;
	public isConnected: boolean = false;

	constructor() {
		this.client = new TCPClient({
			host: HOST,
			port: 58808,//PORT_OUT,
			textMode: false
		});

		this.client.onConnect(() => {
			console.log(`TCP client connected to ${HOST}:${PORT_OUT}`);
			this.isConnected = true;
		});

		this.client.onClose(() => {
			console.log('TCP client disconnected');
			this.isConnected = false;
			// this.scheduleReconnect();
		});

		this.client.connect();
	}

	private scheduleReconnect() {
		if(this.client.isClosed()) {
			this.client.close();
			setTimeout(() => {
				console.log("attempting to connect to " + HOST + ":" + PORT_OUT);
				this.client.connect();
			}, 1000);
		} else {
			console.log("TCP client already connected");
		}
	}
	
	public async send(data: Buffer) {
		this.client.send(data);
	}

	public close() {
		this.client.close();
	}
}

