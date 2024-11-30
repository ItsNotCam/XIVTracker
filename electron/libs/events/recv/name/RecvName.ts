import RecvEventBase from "../RecvEventBase";

export default class RecvNameEvent extends RecvEventBase {
	public override handle = (data: any): void => {
		this.sendToClient("update:name", data.toString());
	}
}