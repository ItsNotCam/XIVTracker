import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { JobModel } from "@electron/types";

const validateJob = (job: JobModel): boolean => {
	return job &&
		typeof job.name === "string" &&
		typeof job.level === "number" &&
		typeof job.expCurrent === "number" &&
		typeof job.expMax === "number";
}

export default class JobActions extends IPCActionBase {
	askJobInfo = async() => {
		try {
			const job = await invoke<JobModel>("ask:job.getCurrent");
			if(!validateJob(job)) {
				throw new Error("Invalid JobModel received")
			} else {
				this.set({ job });
			}
		} catch(e: any) {
			console.error(e);
		}
	}

	handleJobChange = (_: any, newLevel: JobModel) => {
		this.set({ 
			job: {
				...this.get().job,
				...newLevel
			}
		})
	}

	handleXpChange = (_: any, newXp: number) => {
		let job = this.get().job;
		if(!job) return;

		job.expCurrent = newXp;
		this.set({ job })
	}

	askJobs = async () => {
		let jobs = await invoke<JobModel[]>("ask:job.getAll");
		this.set({ jobs });
	}
}