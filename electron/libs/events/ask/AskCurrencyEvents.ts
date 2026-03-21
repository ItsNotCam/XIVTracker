import AskEventBase from "./@AskEventBase";

export default class CurrencyEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("currency.get", this.handleAskGil);
	}

	private handleAskGil = async (): Promise<number | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('currency.get');
			return result.gil as number;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting gil: ${e.message}`);
			return undefined;
		}
	}
}
