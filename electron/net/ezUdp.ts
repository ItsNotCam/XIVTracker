// udpServer.ts
import dgram from 'dgram';

const PORT = parseInt(process.env.UDP_IN || '41234');
const HOST = process.env.HOST_IN || "localhost";

// server handles incoming messages
export default class EzUdpServer {
	private server: dgram.Socket;

	constructor(handle: (msg: Buffer) => void) {
		this.server = dgram.createSocket('udp4');

		// Handle incoming messages
		this.server.on('message', (msg, rinfo) => {
			handle(msg);
		});

		// Handle server listening
		this.server.on('listening', () => {
			const address = this.server.address();
			console.log(`UDP listening on ${address.address}:${address.port}`);
		});

		// Bind the server to the specified port and host
		this.server.bind(PORT, HOST);
	}

	public close() {
		this.server.close();
	}
}
