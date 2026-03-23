import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { JobModel } from "@electron/types";
import z from "zod";
import { typedListener } from "../listeners";


export default class JobActions extends IPCActionBase {
	askJobInfo = async() => {
		const job = JobModel.parse(
			await invoke<JobModel>("ask:job.getCurrent")
		);

		this.set({ job });
	}

	handleJobChange = typedListener<JobModel>((_, newLevel) => {
		const job = {
			...this.get().job,
			...newLevel
		};

		this.set({ job })
	})
	

	handleXpChange = typedListener<number>((_, newXp) => {
		let job = this.get().job;
		if(!job) return;
		job.expCurrent = newXp;
		this.set({ job })
	})

	askJobs = async () => {
		let jobs = z.array(JobModel).parse(
			await invoke<JobModel[]>("ask:job.getAll")
		);

		this.set({ jobs });
	}
}