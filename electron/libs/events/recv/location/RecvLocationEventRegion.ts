import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventRegion extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("ipc-recv:location.regionChanged", params.region);
	}
}
