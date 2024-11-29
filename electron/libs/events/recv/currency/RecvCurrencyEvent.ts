import RecvEventBase from "../RecvEventBase";

export default class RecvCurrencyEvent extends RecvEventBase {
	public override handle = (data: any): void => {
		this.sendToClient("update:currency-gil", data.toString());
	}
}