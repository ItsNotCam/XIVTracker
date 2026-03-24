import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { NameIPCEvent } from "@backend-lib/events/ipc-event-types";

export default class RecvNameEvent extends RecvEventBase<NameIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("ipc-recv:name.changed", params.name);
	}
}
