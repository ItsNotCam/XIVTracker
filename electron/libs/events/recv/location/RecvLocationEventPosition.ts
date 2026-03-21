import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventPosition extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("location.positionChanged", params.position);
	}
}
