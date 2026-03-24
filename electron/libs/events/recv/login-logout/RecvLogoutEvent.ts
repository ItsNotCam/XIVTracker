import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { LoginLogoutIPCEvent } from "@backend-lib/events/ipc-event-types";

export default class RecvLogoutEvent extends RecvEventBase<LoginLogoutIPCEvent> {
	public override handle = (): void => {
		this.sendToClient("ipc-recv:loggedOut");
	}
}
