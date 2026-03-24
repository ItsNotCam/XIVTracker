import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { LoginLogoutIPCEvent } from "@backend-lib/events/ipc-event-types";

export default class RecvLoginEvent extends RecvEventBase<LoginLogoutIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("ipc-recv:loggedIn", params?.name);
	}
}
