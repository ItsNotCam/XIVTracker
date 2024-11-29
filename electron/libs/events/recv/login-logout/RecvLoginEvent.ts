import RecvEventBase from "../RecvEventBase";

export default class RecvLoginEvent extends RecvEventBase {
	public override handle(): void {
		super.sendToClient("broadcast:login");
	}
}