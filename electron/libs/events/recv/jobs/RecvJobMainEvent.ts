import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobMainEvent extends RecvJobEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("ipc-recv:job.changed", params.job);
	}
}
