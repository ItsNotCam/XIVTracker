import RecvEventBase from "../RecvEventBase";

export default class RecvNameEvent extends RecvEventBase {
	public override handle = (params: any): void => {
		this.sendToClient("name.changed", params.name);
	}
}
