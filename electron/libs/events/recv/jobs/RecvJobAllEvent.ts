import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobAllEvent extends RecvJobEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("ipc-recv:job.changed", params.jobs);
	}
}
