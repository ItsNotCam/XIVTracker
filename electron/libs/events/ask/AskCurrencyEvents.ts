import { CurrencyIPCEvent } from "../ipc-event-types";
import AskEventBase from "../@AskEventBase";

export default class CurrencyEvents extends AskEventBase<CurrencyIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ipc-ask:currency.get", this.handleAskGil);
	}

	private handleAskGil = async (): Promise<number> => {
		const { gil } = await this.app.wsClient.request<{ gil: number }>('rpc:currency.get');
		return gil;
	}
}
