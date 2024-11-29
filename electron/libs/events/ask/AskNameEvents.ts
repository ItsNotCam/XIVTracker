import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class NameEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("ask:name", this.handleAskName);
	}

	private handleAskName = async() => {
		if(this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		var response;
		try {
			response = await this.app.wsClient.ask(EzFlag.NAME);
		} catch(e: any) {
			console.log(`[${this.constructor.name}] Error getting name: ${e.message}`);
			return undefined;
		}
		return response;
	}
}