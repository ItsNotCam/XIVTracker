import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobAllEvent extends RecvJobEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("job.changed", params.jobs);
	}
}
