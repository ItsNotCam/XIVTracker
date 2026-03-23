import { LocationIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default abstract class RecvLocationEventBase extends RecvEventBase<LocationIPCEvent> {
	public override handle(_params: any): void {}
}
