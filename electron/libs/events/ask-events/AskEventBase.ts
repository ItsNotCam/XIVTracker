import { ipcMain } from "electron";
import EventBase from "../EventBase";

export default abstract class AskEventBase extends EventBase {
	private handlers: EventType[];

	constructor() {
		super();
		this.handlers = new Array<EventType>();
	}

	public override init(): void {
		console.log(`[${this.constructor.name}] init`);
		this.dispose();
	}

	protected addHandler(event: EventType, handler: (...args: any) => any): void {
		console.log(`[${this.constructor.name}] += '${event}'`);
		this.handlers.push(event);
		ipcMain.handle(event, handler);
	}

	public override dispose(): void {
		this.handlers.forEach((event: EventType ) => {
			ipcMain.removeHandler(event);
		});
		this.handlers = [];
	}
}