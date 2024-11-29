import { EzFlag } from "../../net/EzWs";
import XIVTrackerApp from "../../../app";
import AskEventBase from "./AskEventBase";

export default class LocationEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}

	public override init() {
		super.init();
		super.addHandler("ask:location-all", this.handleGetLocationAll.bind(this));
	}

	private async handleGetLocationAll(): Promise<Location | undefined> {
		if (this.app.GetWebSocketClient().isConnected() === false) {
			return undefined;
		}

		let response: string | undefined;
		try {
			response = await this.app.GetWebSocketClient().ask(EzFlag.LOCATION_ALL);
		} catch (e: any) {
			console.log("Error getting location:", e.message);
			return undefined;
		}

		if(response === undefined) {
			return undefined;
		}

		try {
			return JSON.parse(response);
		} catch (e) {
			console.log("Error parsing location data:", (e as any).message);
		}

		return undefined;
	}
}