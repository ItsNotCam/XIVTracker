import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { JobModel } from "@backend/types";
import z from "zod";
import { typedListener } from "../listeners";


export default class JobActions extends IPCActionBase {
	askJobInfo = async() => {
		const job = await ipcInvoke("ipc-ask:job.getCurrent", JobModel);
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
		let jobs = await ipcInvoke("ipc-ask:job.getAll", z.array(JobModel));
		this.set({ jobs });
	}
}