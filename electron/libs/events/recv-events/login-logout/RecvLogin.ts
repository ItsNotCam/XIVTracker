import RecvEventBase from "../RecvEventBase";

export default class RecvLogin extends RecvEventBase {
	public override handle(): void {
		super.sendToClient("broadcast:login");
	}
}