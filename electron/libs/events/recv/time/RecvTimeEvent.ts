import { TimeIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default class RecvTimeEvent extends RecvEventBase<TimeIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("recv:time.changed", params);
	}
}
