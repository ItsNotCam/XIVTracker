import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventPosition extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("ipc-recv:location.positionChanged", params.position);
	}
}
