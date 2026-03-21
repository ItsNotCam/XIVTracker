import AskEventBase from "./@AskEventBase";

export default class NameEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("name.get", this.handleAskName);
	}

	private handleAskName = async (): Promise<string | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('name.get');
			return result.name as string;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting name: ${e.message}`);
			return undefined;
		}
	}
}
