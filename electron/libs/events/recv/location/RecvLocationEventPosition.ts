import RecvLocationEventBase from "./RecvLocationEventBase";

export default class RecvLocationEventPosition extends RecvLocationEventBase {
	public override handle(data: any): void {
		super.handle(data);
		try {
			const location = JSON.parse(data.toString());
			super.sendToClient("update:location-position", location);
		} catch(e) {
			console.error("Failed to parse location:", e);
		}
	}
}