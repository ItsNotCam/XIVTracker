import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventSubArea extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("recv:location.subAreaChanged", params.subArea);
	}
}
