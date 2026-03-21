import AskEventBase from "./@AskEventBase";

export default class TimeEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("time.get", this.handleAskTime);
	}

	private handleAskTime = async (): Promise<TimeModel | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			return await this.app.wsClient.ask<TimeModel>('time.get');
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting time: ${e.message}`);
			return undefined;
		}
	}
}
