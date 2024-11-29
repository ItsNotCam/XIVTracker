import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class TimeEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("ask:time", this.handleAskTime);
	}

	private  handleAskTime = async(): Promise<string | undefined> => {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}
		return await this.app.wsClient.ask(EzFlag.TIME);
	}
}