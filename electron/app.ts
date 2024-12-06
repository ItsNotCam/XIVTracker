import EventManager from './libs/events/EventManager';
import { BrowserWindow } from 'electron'
import EzWs from './libs/net/EzWs';
import EzDb from '../electron/libs/db/EzDb';

export default class XIVTrackerApp implements IDisposable {
	private _win: BrowserWindow;
	private _wsClient: EzWs;
	private _db: EzDb;
	private _eventRegister: EventManager;

	constructor(win: BrowserWindow) {
		this._win = win;

		console.log("[App Init] Creating WebSocket client");
		this._wsClient = new EzWs(50085, this.receiveMessage, this.handleWsConnected);
		
		console.log("[App Init] Creating DB");
		this._db = new EzDb();

		console.log("[App Init] Creating event register");
		this._eventRegister = new EventManager(this);

		console.log("[App Init] Completed initialization");
	}

	// Getters and setters
	public get win(): BrowserWindow { return this._win }
	private set win(value: BrowserWindow) { this._win = value; }

	public get db(): EzDb { return this._db; }
	private set db(value: EzDb) { this._db = value; }

	public get eventRegister(): EventManager { return this._eventRegister; } 
	private set eventRegister(value: EventManager) { this._eventRegister = value; }

	public get wsClient(): EzWs { return this._wsClient; } 
	private set wsClient(value: EzWs) { this._wsClient = value; }

	public async init(): Promise<XIVTrackerApp> {
		await this.db.init();
		await this.wsClient.connect();
		this.eventRegister.init();
		
		return this;
	}

	private receiveMessage = (data: DeserializedPacket) => {
		this.eventRegister.ReceiveEvent(data.flag, data.payload);
	}

	private handleWsConnected = (isConnected: boolean) => {
		if(this.win && !this.win.isDestroyed()){
			this.win.webContents.send("broadcast:tcp-connected", isConnected);
		}
	}

	public dispose() {
		this.eventRegister.dispose();
		this.db.dispose();
		this.wsClient.dispose();
	}
}