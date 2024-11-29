import RecvJobEventBase from "./RecvJobEventBase";

export default class RecvJobMainEvent extends RecvJobEventBase {
	public override handle(data: any): void {
		super.handle(data);
		try {
			const jobs = JSON.parse(data.toString());
			super.sendToClient("update:job-main", jobs);
		} catch (e) {
			console.log(`[${this.constructor.name}] Failed to parse job json`)
		}
	}
}