import { EzFlag } from "../../net/EzWs";
import XIVTrackerApp from "../../../app";
import AskEventBase from "./AskEventBase";

export default class CurrencyEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}

	public override init() {
		super.init();
		super.addHandler("ask:gil", this.handleAskGil.bind(this));
	}

	private async handleAskGil(_: any): Promise<number | undefined> {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		let gil: number | undefined = undefined;
		try {
			const response = await this.app.wsClient.ask(EzFlag.CURRENCY);
			gil = parseInt(response!);
		} catch (e: any) {
			console.log("Error getting gil:", e.message);
		}

		return gil;
	}
}