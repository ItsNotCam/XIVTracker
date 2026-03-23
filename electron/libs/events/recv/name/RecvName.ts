import { NameIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default class RecvNameEvent extends RecvEventBase<NameIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("recv:name.changed", params.name);
	}
}
