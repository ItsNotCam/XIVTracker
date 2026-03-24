import { ipcMain, IpcMainInvokeEvent } from "electron";
import XIVTrackerApp from "@backend/app";
import { IPCEvent } from "./ipc-event-types";

export default abstract class AskEventBase<E extends IPCEvent = IPCEvent> implements Disposable {
	private handlers: IPCEvent[];
	protected app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		this.handlers = new Array<IPCEvent>();
		this.app = app;
	}

	public init(): void {
		console.log(`[${this.constructor.name}] init`);
		this[Symbol.dispose]();
	}

	protected addHandler<T = any>(
		event: E, 
		handler: (event: IpcMainInvokeEvent, ...args: any[]) => T
	): void {
		console.log(`[${this.constructor.name}] += '${event}'`);
		this.handlers.push(event);
		ipcMain.handle(event, handler);
	}

	[Symbol.dispose](): void {
		this.handlers.forEach((event: IPCEvent ) => {
			ipcMain.removeHandler(event);
		});
		this.handlers = [];
	}
}