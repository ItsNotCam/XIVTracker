import RecvEventBase from "../RecvEventBase";

export default abstract class RecvJobEventBase extends RecvEventBase {
	public override handle(params: any): void {
		this.sendToClient("update:job-*", params);
	}
}
