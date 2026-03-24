import { ConnectionIPCEvent } from "../ipc-event-types";
import AskEventBase from "../@AskEventBase";

export default class ConnectionEvents extends AskEventBase<ConnectionIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ipc-ask:connection.isConnected", this.handleTcpConnected);
	}

	private handleTcpConnected = (): boolean => this.app.wsClient.isConnected();
}
