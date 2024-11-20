import EventRegister from './libs/events/EventRegister';
import { BrowserWindow, ipcMain } from 'electron'
import EzWs from './libs/net/EzWs';
import ezRoute from '../electron/libs/net/EzRouter';
import EzDb from '../electron/libs/db/EzDb';

export default class XIVTrackerApp {
	private win: BrowserWindow;
	private wsClient: EzWs;
	private db: EzDb;
	private eventRegister: EventRegister | null = null;

	constructor(win: BrowserWindow) {
		this.win = win;

		try {
			this.wsClient = new EzWs(
				50085, 
				this.handleUnregisteredMessage,
				this.handleWsConnected
			);
		} catch (e) {
			throw e;
		}
		
		this.db = new EzDb();
		this.eventRegister = new EventRegister(this);
	}

	public async init() {
		await this.db.init();
		this.wsClient.connect();

		if(this.eventRegister) {
			this.eventRegister.init();
		}

		this.initWindowControls();
	}
	
	public getDB = () => this.db;
	public getWindow = () => this.win;
	public getIpcMain = () => ipcMain;
	public GetWebSocketClient = () => this.wsClient;

	public close() {
		this.wsClient.close();
		this.db.close();
		this.eventRegister!.close();
	}
	
	private handleUnregisteredMessage = (data: DeserializedPacket) => {
		ezRoute(this.win, data as DeserializedPacket);
	}

	private handleWsConnected = () => {
		this.win.webContents.send("broadcast:tcp-connected", true);
	}

	private initWindowControls() {
		ipcMain.on("exit", () => {
			console.log("exit event received");
			if (this.win) {
				this.win.close();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		ipcMain.on("minimize", () => {
			console.log("minimize event received");
			if (this.win) {
				this.win.isMinimized() ? this.win.restore() : this.win.minimize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		ipcMain.on("maximize", () => {
			console.log("maximize event received");
			if (this.win) {
				this.win.isMaximized() ? this.win.unmaximize() : this.win.maximize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});
	}
}