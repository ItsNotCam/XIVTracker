import RecvEventBase from "../RecvEventBase";

export default class RecvJobEventBase extends RecvEventBase {
	public override handle(data: any): void {
		try {
			const jobs = JSON.parse(data.toString());
			super.sendToClient("update:job-*", jobs);
		} catch (e) {
			console.log(`[${this.constructor.name}] Failed to parse job json`)
		}
	}
}