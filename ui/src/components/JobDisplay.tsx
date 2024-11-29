import React, { useEffect } from 'react';
import XPBar from '@ui/components/XPBar';
import { JobIconList } from '@assets/images/jobs';
import { invoke, onReceive, removeListener } from '@ui/util/util';

const JobDisplay: React.FC = () => {
	const [job, setJob] = React.useState<XIVJob>({
		job_name: "???",
		level: 0,
		current_xp: 0,
		max_xp: 0
	});

	const getJobInfo = async() => {
		const result: XIVJob = await invoke(`ask:job-current`);
		setJob(result);
	}

	const handleJobChange = (_event: any, newJob: XIVJob) => {
		setJob((current: XIVJob) => ({
			...current,
			...newJob
		}));
	}

	const handleLevelChange = (_event: any, newLevel: XIVJob) => {
		setJob((current: XIVJob) => ({
			...current,
			level: newLevel.level,
			current_xp: newLevel.current_xp,
			max_xp: newLevel.max_xp
		}));
	}

	const handleXpChange = (_event: any, newXp: number) => {
		setJob((current: XIVJob) => ({
			...current,
			current_xp: newXp
		}));
	}

	useEffect(() => {
		getJobInfo();

		onReceive(`update:job-current`, handleJobChange);
		onReceive(`update:job-main`, handleJobChange);
		onReceive("update:level", handleLevelChange);
		onReceive("update:xp", handleXpChange);
		onReceive("broadcast:tcp-connected", getJobInfo);
		onReceive("broadcast:login", getJobInfo);

		return () => {
			removeListener(`update:job-current`, handleJobChange)
			removeListener(`update:job-main`, handleJobChange)
			removeListener("update:level", handleLevelChange);
			removeListener("update:xp", handleXpChange);
			removeListener("broadcast:tcp-connected", getJobInfo);
			removeListener("broadcast:login", getJobInfo);
		};
	}, []);

	return (
		<div className="relative grid grid-cols-[70px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img
				className="col-start-1 col-end-2 row-start-1 row-end-3"
				src={job ? JobIconList[job.job_name.toLowerCase().replace(" ", "-")] : JobIconList["dark-knight"]}
			/>
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {job ? job.level : 0}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2 
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">
					{job ? job.job_name[0] : "u"}
				</span>
				<span className="text-3xl">
					{job ? job.job_name.slice(1).toLowerCase() : "ninitialized"}
				</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={job ? job.current_xp : 0} maxXP={job ? job.max_xp : 0} />
			</div>
		</div>
	);
};

export default JobDisplay;