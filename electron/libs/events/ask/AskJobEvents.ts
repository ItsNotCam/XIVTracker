import { JobModel } from "@backend/types";
import AskEventBase from "../@AskEventBase";
import { JobIPCEvent } from "../ipc-event-types";

export default class JobEvents extends AskEventBase<JobIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ipc-ask:job.getCurrent", this.makeWsHandler<{ job: JobModel }>('rpc:job.getCurrent', 'job'));
		super.addHandler("ipc-ask:job.getAll", this.makeWsHandler<{ jobs: JobModel[] }>('rpc:job.getAll', 'jobs'));
	}
	
	private makeWsHandler = <T>(action: JsonRpcAskMethod, key: keyof T) => {
		return async (): Promise<T[keyof T]> => {
			if (!this.app.wsClient.isConnected()) throw new Error("Websocket not connected");
			const result = await this.app.wsClient.request<T>(action);
			return result[key];
		}
	}
}
