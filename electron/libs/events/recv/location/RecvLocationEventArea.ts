import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventArea extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("recv:location.areaChanged", params.area);
	}
}
