import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { CurrencyIPCEvent } from "@backend-lib/events/ipc-event-types";

export default class RecvCurrencyEvent extends RecvEventBase<CurrencyIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("ipc-recv:currency.changed", params.gil);
	}
}
