import { JobModel } from "@electron/types";
import AskEventBase from "../@AskEventBase";
import { JobIPCEvent } from "../ipc-event-types";

export default class JobEvents extends AskEventBase<JobIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ask:job.getMain", this.makeWsHandler<{ job: JobModel }>('job.getMain', 'job'));
		super.addHandler("ask:job.getCurrent", this.makeWsHandler<{ job: JobModel }>('job.getCurrent', 'job'));
		super.addHandler("ask:job.getAll", this.makeWsHandler<{ jobs: JobModel[] }>('job.getAll', 'jobs'));
	}
	
	private makeWsHandler = <T>(action: JsonRpcAskMethod, key: keyof T) => {
		return async (): Promise<T[keyof T]> => {
			if (!this.app.wsClient.isConnected()) throw new Error("Websocket not connected");
			const result = await this.app.wsClient.ask<T>(action);
			return result[key];
		}
	}
}
