import EventManager from './libs/events/EventManager';
import { BrowserWindow, ipcMain } from 'electron'
import EzWs from './libs/net/EzWs';
import EzDb from '../electron/libs/db/EzDb';

export default class XIVTrackerApp implements IDisposable {
	private win: BrowserWindow;
	private wsClient: EzWs;
	private db: EzDb;
	private eventRegister: EventManager;

	constructor(win: BrowserWindow) {
		this.win = win;

		console.log("[App Init] Creating WebSocket client");
		this.wsClient = new EzWs(
			50085, 
			this.receiveMessage,
			this.handleWsConnected.bind(this)
		);
		
		console.log("[App Init] Creating DB");
		this.db = new EzDb();

		console.log("[App Init] Creating event register");
		this.eventRegister = new EventManager(this);

		console.log("[App Init] Completed initialization");
	}

	public async init(): Promise<XIVTrackerApp> {
		await this.db.init();
		await this.wsClient.connect();
		
		this.eventRegister.init();
		return this;
	}
	
	public getDB = () => this.db;
	public getWindow = () => this.win;
	public getIpcMain = () => ipcMain;
	public GetWebSocketClient = () => this.wsClient;

	private receiveMessage = (data: DeserializedPacket) => {
		this.eventRegister.ReceiveEvent(data.flag, data.payload);
	}

	private handleWsConnected = (isConnected: boolean) => {
		this.win.webContents.send("broadcast:tcp-connected", isConnected);
	}

	public dispose() {
		this.wsClient.close();
		this.db.dispose();
		this.eventRegister.dispose();
	}
}