import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { TimeIPCEvent } from "@backend-lib/events/ipc-event-types";

export default class RecvTimeEvent extends RecvEventBase<TimeIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("ipc-recv:time.changed", params);
	}
}
