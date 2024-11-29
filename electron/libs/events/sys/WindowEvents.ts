import EventBase from "../EventBase";
import { ipcMain } from "electron";

export default class WindowEvents extends EventBase {
	private readonly win: Electron.BrowserWindow | null;
	private windowEvents: Map<string, (...args: any) => any>;

	constructor(win: Electron.BrowserWindow | null) {
		super();
		this.win = win;
		this.windowEvents = new Map();
	}

	public init() {
		if (!this.win) {
			console.error("BrowserWindow instance is not valid.");
			return;
		}

		this.addListener("exit", () => {
			console.log("exit event received");
			if (this.win) {
				this.win.close();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		this.addListener('minimize', () => {
			console.log("minimize event received");
			if (this.win) {
				this.win.isMinimized() ? this.win.restore() : this.win.minimize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		this.addListener('maximize', () => {
			console.log("maximize event received");
			if (this.win) {
				this.win.isMaximized() ? this.win.unmaximize() : this.win.maximize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});
	}

	protected addListener(event: string, handler: (...args: any) => any): void {
		this.windowEvents.set(event, handler);
		ipcMain.addListener(event, handler);
	}

	public override dispose() {
		Object.entries(this.windowEvents).forEach(([eventType, handler]) => {
			ipcMain.removeListener(eventType, handler);
		});
		this.windowEvents.clear();
	}
}