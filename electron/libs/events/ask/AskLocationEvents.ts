import AskEventBase from "./@AskEventBase";

export default class LocationEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("location.getAll", this.handleGetLocationAll);
	}

	private handleGetLocationAll = async (): Promise<LocationModel | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('location.getAll');
			return result.location as LocationModel;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting location: ${e.message}`);
			return undefined;
		}
	}
}
