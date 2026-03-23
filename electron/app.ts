import EventManager from './libs/events/EventManager';
import { BrowserWindow } from 'electron'
import JsonRpcClient from './libs/net/JsonRpcClient';
import EzDb from '../electron/libs/db/EzDb';

export default class XIVTrackerApp implements Disposable {
	private _win: BrowserWindow;
	private _wsClient: JsonRpcClient;
	private _db: EzDb;
	private _eventRegister: EventManager;

	constructor(win: BrowserWindow) {
		this._win = win;

		console.log("[App Init] Creating WebSocket client");
		this._wsClient = new JsonRpcClient('ws://localhost:50085', this.handleWsConnected);

		console.log("[App Init] Creating DB");
		this._db = new EzDb();

		console.log("[App Init] Creating event register");
		this._eventRegister = new EventManager(this);

		console.log("[App Init] Completed initialization");
	}

	public get win(): BrowserWindow { return this._win }
	private set win(value: BrowserWindow) { this._win = value; }

	public get db(): EzDb { return this._db; }
	private set db(value: EzDb) { this._db = value; }

	public get eventRegister(): EventManager { return this._eventRegister; }
	private set eventRegister(value: EventManager) { this._eventRegister = value; }

	public get wsClient(): JsonRpcClient { return this._wsClient; }
	private set wsClient(value: JsonRpcClient) { this._wsClient = value; }

	public async init(): Promise<XIVTrackerApp> {
		await Promise.all([
			this.db.init(),
			this.eventRegister.init()
		]);
		this.wsClient.connect();
		return this;
	}

	private handleWsConnected = (isConnected: boolean) => {
		if (this.win && !this.win.isDestroyed()) {
			this.win.webContents.send("connection.changed", isConnected);
		}
	}

	[Symbol.dispose]() {
		this.eventRegister.dispose();
		this.db.dispose();
		this.wsClient.dispose();
	}
}
