import RecvEventBase from "../RecvEventBase";

export default abstract class RecvLocationEventBase extends RecvEventBase {
	public override handle(data: any): void {
		try {
			const location = JSON.parse(data.toString());
			this.sendToClient("update:location-*", location);
		} catch(e) {
			console.error("Failed to parse location:", e);
		}
	}
}