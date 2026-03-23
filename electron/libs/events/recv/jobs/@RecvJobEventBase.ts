import { JobIPCEvent } from "@electron-lib/events/ipc-event-types";
import RecvEventBase from "../../@RecvEventBase";

export default abstract class RecvJobEventBase extends RecvEventBase<JobIPCEvent> {
	public override handle(_params: any): void {}
}
