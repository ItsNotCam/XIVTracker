import WebSocket from 'ws';

type PendingRequest = {
	method: string
	resolve: (result: any) => void
	reject: (reason: any) => void
}

type NotificationHandler = (params: any) => void

const normalizeMethod = (method: JsonRpcMethod) => {
		return method.replace(/^[^:]+:/, '')
}

export default class JsonRpcClient {
	private socket: WebSocket | null = null
	private pending = new Map<number, PendingRequest>()
	private handlers = new Map<string, NotificationHandler>()
	private nextId = 1
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null

	constructor(
		private readonly url: string,
		private readonly onConnected: (connected: boolean) => void
	) {}

	connect(): void {
		try {
			console.log("Creating new websocket:", this)
			this.socket = new WebSocket(this.url)
		} catch {
			this.onConnected(false)
			this.scheduleReconnect()
			return
		}
		this.socket.on('open', () => this.onConnected(true))
		this.socket.on('close', () => {
			this.onConnected(false)
			this.scheduleReconnect()
		})
		this.socket.on('error', () => this.scheduleReconnect())
		this.socket.on('message', (data) => this.handleMessage(data.toString()))
	}

	request<T = any>(method: JsonRpcAskMethod, params: object = {}): Promise<T> {
		const wsMethod = normalizeMethod(method);
		console.log(`Requesting ${wsMethod}`);

		return new Promise((resolve, reject) => {
			if (!this.isConnected() || !this.socket) return reject(new Error('Not connected'))

			const id = this.nextId++
			this.pending.set(id, { method, resolve, reject })
			
			this.socket.send(JSON.stringify({ jsonrpc: '2.0', method: wsMethod, params, id }))

			setTimeout(() => {
				if (!this.pending.has(id)) return
				this.pending.delete(id)
				reject(new Error(`Request ${wsMethod} timed out`))
			}, 5000)
		})
	}

	on(method: JsonRpcNotifyMethod, handler: NotificationHandler): void {
		this.handlers.set(normalizeMethod(method), handler)
	}

	off(method: JsonRpcNotifyMethod): void {
		this.handlers.delete(normalizeMethod(method))
	}

	isConnected(): boolean {
		return this.socket?.readyState === WebSocket.OPEN
	}

	private handleMessage(data: string): void {
		let msg: any
		try { msg = JSON.parse(data) } catch { return }

		
		if (msg.id !== undefined) {
			const handler = this.pending.get(msg.id)
			console.log(`[${handler?.method}] Received ${data}`);
			
			if (!handler) return
			this.pending.delete(msg.id)
			if (msg.error) handler.reject(new Error(msg.error.message))
				else handler.resolve(msg.result)
		} else {
			console.log(`Received ${data}`);
			this.handlers.get(msg.method)?.(msg.params)
		}
	}

	private scheduleReconnect(): void {
		if (this.reconnectTimer) return
		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null
			this.connect()
		}, 2000)
	}

	dispose(): void {
		if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
		this.socket?.close()
	}
}
