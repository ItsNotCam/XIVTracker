import AskEventBase from "./@AskEventBase";
import { JobModel } from "../../JobState";

export default class JobEvents extends AskEventBase {
	public override init() {
		super.init();
		super.addHandler("job.getMain", this.handleAskJobMain);
		super.addHandler("job.getCurrent", this.handleAskJobCurrent);
		super.addHandler("job.getAll", this.handleAskJobAll);
	}

	private handleAskJobMain = async (): Promise<JobModel | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('job.getMain');
			return result.job as JobModel;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting job: ${e.message}`);
			return undefined;
		}
	}

	private handleAskJobCurrent = async (): Promise<JobModel | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('job.getCurrent');
			return result.job as JobModel;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting job: ${e.message}`);
			return undefined;
		}
	}

	private handleAskJobAll = async (): Promise<JobModel[] | undefined> => {
		if (!this.app.wsClient.isConnected()) return undefined;
		try {
			const result = await this.app.wsClient.ask('job.getAll');
			return result.jobs as JobModel[];
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting jobs: ${e.message}`);
			return undefined;
		}
	}
}
