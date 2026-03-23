import { TimeModel } from "@electron/types";
import AskEventBase from "../@AskEventBase";
import { TimeIPCEvent } from "../ipc-event-types";

export default class TimeEvents extends AskEventBase<TimeIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ask:time.get", this.handleAskTime);
	}

	private handleAskTime = async (): Promise<TimeModel | undefined> => {
		return await this.app.wsClient.ask<TimeModel>('time.get');
	}
}
