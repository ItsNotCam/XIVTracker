import AskEventBase from "./@AskEventBase";

export default class ConnectionEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("connection.isConnected", this.handleTcpConnected);
	}

	private handleTcpConnected = (): boolean => this.app.wsClient.isConnected();
}
