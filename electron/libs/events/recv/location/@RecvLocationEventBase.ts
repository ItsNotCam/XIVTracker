import RecvEventBase from "../RecvEventBase";

export default abstract class RecvLocationEventBase extends RecvEventBase {
	public override handle(params: any): void {
		this.sendToClient("update:location-*", params);
	}
}
