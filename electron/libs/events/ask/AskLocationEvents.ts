import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class LocationEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("ask:location-all", this.handleGetLocationAll);
	}

	private handleGetLocationAll = async(): Promise<Location | undefined> => {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		let response: string | undefined;
		try {
			response = await this.app.wsClient.ask(EzFlag.LOCATION_ALL);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting location: ${e.message}`);
			return undefined;
		}

		if(response === undefined) {
			return undefined;
		}

		try {
			return JSON.parse(response) as Location;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting location: ${e.message}`);
		}

		return undefined;
	}
}