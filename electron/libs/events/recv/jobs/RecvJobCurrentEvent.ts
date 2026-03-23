import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobCurrentEvent extends RecvJobEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("recv:job.changed", params.job);
	}
}
