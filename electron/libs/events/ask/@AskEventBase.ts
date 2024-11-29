import { ipcMain } from "electron";
import XIVTrackerApp from "@electron/app";
import EventBase from "../EventBase";

export default abstract class AskEventBase implements EventBase {
	private handlers: EventType[];
	protected app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		this.handlers = new Array<EventType>();
		this.app = app;
	}

	public init(): void {
		console.log(`[${this.constructor.name}] init`);
		this.dispose();
	}

	protected addHandler(event: EventType, handler: (...args: any) => any): void {
		console.log(`[${this.constructor.name}] += '${event}'`);
		this.handlers.push(event);
		ipcMain.handle(event, handler);
	}

	public dispose = (): void => {
		this.handlers.forEach((event: EventType ) => {
			ipcMain.removeHandler(event);
		});
		this.handlers = [];
	}
}