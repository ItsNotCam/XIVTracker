import { NameIPCEvent } from "../ipc-event-types";
import AskEventBase from "../@AskEventBase";

export default class NameEvents extends AskEventBase<NameIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ipc-ask:name.get", this.handleAskName);
	}

	private handleAskName = async (): Promise<string> => {
		const { name } = await this.app.wsClient.request<{ name: string }>('rpc:name.get');
		return name;
	}
}
