import RecvEventBase from "../RecvEventBase";

export default class RecvLogoutEvent extends RecvEventBase {
	public override handle(): void {
		super.sendToClient("broadcast:logout");
	}
}