import RecvEventBase from "../RecvEventBase";

export default class RecvLoginEvent extends RecvEventBase {
	public override handle = (params: any): void => {
		this.sendToClient("loggedIn", params?.name);
	}
}
