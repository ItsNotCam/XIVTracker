import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobCurrentEvent extends RecvJobEventBase {
	public override handle = (data: any): void => {
		super.handle(data);
		try {
			const job = JSON.parse(data.toString());
			this.sendToClient("update:job-current", job);
		} catch (e) {
			console.log(`[${this.constructor.name}] Failed to parse job json`)
		}
	}
}