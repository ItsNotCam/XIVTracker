import RecvEventBase from "../RecvEventBase";

export default class RecvCurrencyEvent extends RecvEventBase {
	public override handle = (params: any): void => {
		this.sendToClient("currency.changed", params.gil);
	}
}
