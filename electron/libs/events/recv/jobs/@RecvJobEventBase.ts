import RecvEventBase from "@backend-lib/events/@RecvEventBase";
import { JobIPCEvent } from "@backend-lib/events/ipc-event-types";

export default abstract class RecvJobEventBase extends RecvEventBase<JobIPCEvent> {
	public override handle(_params: any): void {}
}
