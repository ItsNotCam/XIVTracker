import RecvEventBase from "../RecvEventBase";

export default class RecvLocationEventBase extends RecvEventBase {
	public override handle(data: any): void {
		try {
			const location = JSON.parse(data.toString());
			super.sendToClient("update:location-*", location);
		} catch(e) {
			console.error("Failed to parse location:", e);
		}
	}
}