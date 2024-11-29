import XIVTrackerApp from "../../../app";
import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./AskEventBase";

export default class NameEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}
	
	public override init() {
		super.init();
		super.addHandler("ask:name", this.handleAskName.bind(this));
	}

	private async handleAskName() {
		if(this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		var response;
		try {
			response = await this.app.wsClient.ask(EzFlag.NAME);
		} catch(e: any) {
			console.error("Error getting name:", e.message);
			return undefined;
		}
		return response;
	}
}