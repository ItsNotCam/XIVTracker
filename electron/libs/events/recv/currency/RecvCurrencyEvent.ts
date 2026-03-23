import { CurrencyIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default class RecvCurrencyEvent extends RecvEventBase<CurrencyIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("recv:currency.changed", params.gil);
	}
}
