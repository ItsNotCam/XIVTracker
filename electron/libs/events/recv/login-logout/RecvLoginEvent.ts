import RecvEventBase from "../RecvEventBase";

export default class RecvLoginEvent extends RecvEventBase {
	public override handle = (): void => {
		this.sendToClient("broadcast:login");
	}
}