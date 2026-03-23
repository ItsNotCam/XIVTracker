import { CurrencyIPCEvent } from "../ipc-event-types";
import AskEventBase from "../@AskEventBase";

export default class CurrencyEvents extends AskEventBase<CurrencyIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ask:currency.get", this.handleAskGil);
	}

	private handleAskGil = async (): Promise<number> => {
		const { gil } = await this.app.wsClient.ask<{ gil: number }>('currency.get');
		return gil;
	}
}
