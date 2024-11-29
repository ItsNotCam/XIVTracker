import XIVTrackerApp from "../../../app";
import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class TimeEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}

	public override init() {
		super.init();
		super.addHandler("ask:time", this.handleAskTime.bind(this));
	}

	private async handleAskTime(): Promise<string | undefined> {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		return await this.app.wsClient.ask(EzFlag.TIME);
	}
}