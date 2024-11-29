import JobState from "../..//JobState";
import { EzFlag } from "../..//net/EzWs";
import XIVTrackerApp from "../../../app";
import AskEventBase from "./AskEventBase";

export default class JobEvents extends AskEventBase {
	app: XIVTrackerApp;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
	}

	public override init() {
		super.init();
		super.addHandler("ask:job-main", this.handleAskJobMain.bind(this));
		super.addHandler("ask:job-all", this.handleAskJobAll.bind(this));
	}

	private async handleAskJobMain(): Promise<JobState | undefined> {
		if (this.app.GetWebSocketClient().isConnected() === false) {
			return undefined;
		}

		let response: string | undefined;
		try {
			response = await this.app.GetWebSocketClient().ask(EzFlag.JOB_MAIN);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting main job: ${e.message}`);
			return undefined;
		}

		try {
			return JobState.fromJson(response!);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error parsing job data: ${e.message}`);
		}

		return undefined;
	}

	private async handleAskJobAll(): Promise<JobState | undefined> {
		if (this.app.GetWebSocketClient().isConnected() === false) {
			return undefined;
		}

		let response: string | undefined;
		try {
			response = await this.app.GetWebSocketClient().ask(EzFlag.JOB_ALL);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error getting all jobs: ${e.message}`);
			return undefined;
		}

		if(response === undefined) {
			return undefined;
		}

		try {
			return JSON.parse(response);
		} catch (e: any) {
			console.log(`[${this.constructor.name}] Error parsing job data: ${e.message}`);
		}

		return undefined;
	}
}