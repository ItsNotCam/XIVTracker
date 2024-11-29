import { EzFlag } from "../../net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class CurrencyEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("ask:currency-gil", this.handleAskGil);
	}

	private handleAskGil = async(_: any): Promise<number | undefined> => {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		let gil: number | undefined = undefined;
		try {
			const response = await this.app.wsClient.ask(EzFlag.CURRENCY);
			console.log(`[${this.constructor.name}] response: ${response}`);
			gil = parseInt(response!);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting gil: ${e.message}`);
		}

		return gil;
	}
}