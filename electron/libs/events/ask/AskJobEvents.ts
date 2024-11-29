import JobState from "../..//JobState";
import { EzFlag } from "../..//net/EzWs";
import AskEventBase from "./@AskEventBase";

export default class JobEvents extends AskEventBase {
	public override init() {
		super.init();
		
		super.addHandler("ask:job-main", this.handleAskJobMain);
		super.addHandler("ask:job-current", this.handleAskJobCurrent);
		super.addHandler("ask:job-all", this.handleAskJobAll);
	}

	private handleAskJobMain = async(): Promise<JobState | undefined> => {
		return await this.askJob(EzFlag.JOB_MAIN) as JobState;
	}

	private handleAskJobCurrent = async(): Promise<JobState | undefined> => {
		return await this.askJob(EzFlag.JOB_CURRENT) as JobState;
	}

	private handleAskJobAll = async(): Promise<JobState[] | undefined> => {
		return await this.askJob(EzFlag.JOB_ALL) as JobState[];
	}

	private askJob = async(routeFlag: EzFlag): Promise<JobState | JobState[] | undefined> => {
		if (this.app.wsClient.isConnected() === false) {
			return undefined;
		}

		let response: string | undefined;
		try {
			response = await this.app.wsClient.ask(routeFlag);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting job: ${e.message}`);
			return undefined;
		}

		try {
			const js = JSON.parse(response!);
			return Array.isArray(js) ? js as JobState[] : js as JobState;
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error parsing job data: ${e.message}`);
		}

		return undefined;
	}
}