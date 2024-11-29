import { BrowserWindow } from "electron";

export default abstract class RecvEventBase {
	private win: BrowserWindow;

	constructor(win: BrowserWindow) {
		this.win = win;
	}

	public abstract handle(data: any): void;

	protected sendToClient = (event: EventType, data?: any): void => {
		if(this.win.isDestroyed()) {
			throw(`[${this.constructor.name}] Window is destroyed`);
		}

		this.win.webContents.send(event, data);
	}
}