import { BrowserWindow } from "electron";
import { IPCEvent } from "./ipc-event-types";

export default abstract class RecvEventBase<E extends IPCEvent = IPCEvent> {
	private win: BrowserWindow;

	constructor(win: BrowserWindow) {
		this.win = win;
	}

	public abstract handle(data: any): void;

	protected sendToClient = (event: E, data?: any): void => {
    if (this.win.isDestroyed()) {
      throw `[${this.constructor.name}] Window is destroyed`;
    }
    this.win.webContents.send(event, data);
  };
}