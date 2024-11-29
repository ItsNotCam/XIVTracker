import RecvEventBase from "../RecvEventBase";

export default class RecvLogoutEvent extends RecvEventBase {
	public override handle = (): void => {
		this.sendToClient("broadcast:logout");
	}
}