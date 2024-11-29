import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventTerritory extends RecvLocationEventBase {
	public override handle = (data: any): void => {
		super.handle(data);
		try {
			const location = JSON.parse(data.toString());
			this.sendToClient("update:location-territory", location);
		} catch(e) {
			console.error("Failed to parse location:", e);
		}
	}
}