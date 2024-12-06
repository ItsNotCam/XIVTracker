import RecvJobEventBase from "./@RecvJobEventBase";

export default class RecvJobMainEvent extends RecvJobEventBase {
	public override handle = (data: any): void => {
		super.handle(data);
		try {
			const job = JSON.parse(data.toString());
			this.sendToClient("update:job-main", job);
		} catch (e) {
			console.log(`[${this.constructor.name}] Failed to parse job json`)
		}
	}
}