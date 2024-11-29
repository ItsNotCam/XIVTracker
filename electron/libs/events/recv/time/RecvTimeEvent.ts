import RecvEventBase from "../RecvEventBase";

export default class RecvTimeEvent extends RecvEventBase {
	public override handle = (data: any): void => {
		this.sendToClient("update:time", data.toString());
	}
}