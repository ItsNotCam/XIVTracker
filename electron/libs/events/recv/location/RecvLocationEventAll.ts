import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventAll extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("location.changed", params.location);
	}
}
