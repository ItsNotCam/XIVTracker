import RecvEventBase from "../RecvEventBase";

export default class RecvTimeEvent extends RecvEventBase {
	public override handle(data: any): void {
		super.sendToClient("update:time", data.toString());
	}
}