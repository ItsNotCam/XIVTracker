import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { LocationIPCEvent } from "@backend-lib/events/ipc-event-types";

export default abstract class RecvLocationEventBase extends RecvEventBase<LocationIPCEvent> {
	public override handle(_params: any): void {}
}
