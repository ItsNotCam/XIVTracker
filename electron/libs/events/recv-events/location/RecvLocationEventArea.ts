import RecvLocationEventBase from "./RecvLocationEventBase";

export default class RecvLocationEventArea extends RecvLocationEventBase {
	public override handle(data: any): void {
		super.handle(data);
		try {
			const location = JSON.parse(data.toString());
			super.sendToClient("update:location-area", location);
		} catch(e) {
			console.error("Failed to parse location:", e);
		}
	}
}