import { LoginLogoutIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default class RecvLogoutEvent extends RecvEventBase<LoginLogoutIPCEvent> {
	public override handle = (): void => {
		this.sendToClient("recv:loggedOut");
	}
}
