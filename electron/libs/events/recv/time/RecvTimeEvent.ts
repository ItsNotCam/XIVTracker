import RecvEventBase from "../RecvEventBase";

export default class RecvTimeEvent extends RecvEventBase {
	public override handle = (params: any): void => {
		this.sendToClient("time.changed", params);
	}
}
