import { BrowserWindow } from "electron";

export default abstract class RecvEventBase {
	win: BrowserWindow;
	constructor(win: BrowserWindow) {
		this.win = win;
	}

	public abstract handle(data: any): void;

	public sendToClient(event: EventType, data?: any): void {
		if(this.win.isDestroyed()) {
			throw(`[${this.constructor.name}] Window is destroyed`);
		}

		if(data) {
			this.win.webContents.send(event, data);
		} else {
			this.win.webContents.send(event);
		}
	}
}