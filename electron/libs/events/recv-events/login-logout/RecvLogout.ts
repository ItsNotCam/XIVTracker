import RecvEventBase from "../RecvEventBase";

export default class RecvLogout extends RecvEventBase {
	public override handle(): void {
		super.sendToClient("broadcast:logout");
	}
}