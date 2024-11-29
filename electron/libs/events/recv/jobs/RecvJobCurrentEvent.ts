import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobCurrentEvent extends RecvJobEventBase {
	public override handle(data: any): void {
		super.handle(data);
		try {
			const jobs = JSON.parse(data.toString());
			super.sendToClient("update:job-current", jobs);
		} catch (e) {
			console.log(`[${this.constructor.name}] Failed to parse job json`)
		}
	}
}