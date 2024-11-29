import RecvEventBase from "../RecvEventBase";

export default class RecvNameEvent extends RecvEventBase {
	public override handle(data: any): void {
		try {
			super.sendToClient("update:name", data.toString());
		} catch(e) {
			console.error("Failed to parse name:", e);
		}
	}
}