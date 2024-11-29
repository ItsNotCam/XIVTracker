import XIVTrackerApp from "@electron/app";
import AskEventBase from "./AskEventBase";

export default class ConnectionEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}

	public override init() {
		super.init();
		super.addHandler("ask:tcp-connected", this.handleTcpConnected.bind(this));
	}

	private handleTcpConnected(): boolean {
		if(this.app === undefined) {
			return false;
		}

		return this.app.wsClient.isConnected();
	}
}