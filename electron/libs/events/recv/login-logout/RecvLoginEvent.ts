import { LoginLogoutIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default class RecvLoginEvent extends RecvEventBase<LoginLogoutIPCEvent> {
	public override handle = (params: any): void => {
		this.sendToClient("recv:loggedIn", params?.name);
	}
}
