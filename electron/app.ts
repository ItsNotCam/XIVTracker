import EventManager from './libs/events/EventManager';
import { BrowserWindow } from 'electron'
import JsonRpcClient from './libs/net/JsonRpcClient';
import EzDb from '../electron/libs/db/EzDb';

export default class XIVTrackerApp implements Disposable {
	#win: BrowserWindow;
	#wsClient: JsonRpcClient;
	#db: EzDb;
	#eventRegister: EventManager;

	constructor(win: BrowserWindow) {
		this.#win = win;

		console.log("[XIVTrackerApp Creation] Creating WebSocket client");
		this.#wsClient = new JsonRpcClient('ws://localhost:50085', this.handleWsConnected);

		console.log("[XIVTrackerApp Creation] Creating DB");
		this.#db = new EzDb();

		console.log("[XIVTrackerApp Creation] Creating event register");
		this.#eventRegister = new EventManager(this.#win, this.#wsClient, this.#db);

		console.log("[XIVTrackerApp Creation] Completed creation");
	}

	public get win(): BrowserWindow { return this.#win }
	private set win(value: BrowserWindow) { this.#win = value; }

	public get db(): EzDb { return this.#db; }
	private set db(value: EzDb) { this.#db = value; }

	public get eventRegister(): EventManager { return this.#eventRegister; }
	private set eventRegister(value: EventManager) { this.#eventRegister = value; }

	public get wsClient(): JsonRpcClient { return this.#wsClient; }
	private set wsClient(value: JsonRpcClient) { this.#wsClient = value; }

	public async init(): Promise<XIVTrackerApp> {
		console.log("[XIVTrackerApp Init] XIV Tracker app initialized called");
		
		console.log("[XIVTrackerApp Init] Initializing database");
		await this.db.init();
		
		console.log("[XIVTrackerApp Init] Initializing event register");
		this.eventRegister.register()

		console.log("[XIVTrackerApp Init] Connecting to websocket client")
		this.wsClient.connect();

		console.log("[XIVTrackerApp Init] XIVTrackerApp Initialized")
		return this;
	}

	private handleWsConnected = (isConnected: boolean) => {
		if (this.win && !this.win.isDestroyed()) {
			this.win.webContents.send("ipc-recv:connection.changed", isConnected);
		}
	}

	[Symbol.dispose]() {
		this.db[Symbol.dispose]();
		this.wsClient[Symbol.dispose]();
	}
}
