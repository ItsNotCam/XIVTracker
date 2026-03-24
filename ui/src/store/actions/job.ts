import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { JobModel } from "@backend/types";
import z from "zod";
import { typedListener } from "../listeners";


export default class JobActions extends IPCActionBase {
	askJobInfo = async() => {
		const { job } = await ipcInvoke("ipc-ask:job.getCurrent", z.object({ job: JobModel }));
		this.set({ job });
	}

	handleJobChange = typedListener<{ job: JobModel }>((_, { job }) => {
		this.set({ job })
	})
	

	handleXpChange = typedListener<number>((_, newXp) => {
		let job = this.get().job;
		if(!job) return;
		job.expCurrent = newXp;
		this.set({ job })
	})

	askJobs = async () => {
		const { jobs } = await ipcInvoke("ipc-ask:job.getAll", z.object({ jobs: z.array(JobModel) }));
		this.set({ jobs });
	}
}