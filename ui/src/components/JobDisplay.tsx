// @ts-ignore
import * as __WebpackModuleApi from 'webpack-module-api';

import React, { useEffect } from 'react';
import XPBar from '@ui/components/XPBar';
import { Job } from '@electron/@types/Common';

import { invoke, onReceive } from '@electron-lib/events/eventHelpers';
import JobIcons from '@ui/util/jobIcons';

interface JobDisplayProps {
	type: "current" | "main",
	initialJob: Job
}

const JobDisplay: React.FC<JobDisplayProps> = ({ type = "main", initialJob }) => {
	const getJobInfoTimeout = React.useRef<NodeJS.Timeout | null>(null);
	const [job, setJob] = React.useState<Job>(initialJob);

	const getJobInfo = async() => {
		const result: Job = await invoke(`ask:job-${type}`);
		if(result === undefined) {
			if(getJobInfoTimeout.current) {
				clearTimeout(getJobInfoTimeout.current);
			}
			
			getJobInfoTimeout.current = setTimeout(getJobInfo, 500);
		} else {
			setJob(result);
		}
	}

	const handleJobChange = (_event: Electron.Event, newJob: Job) => {
		setJob((current: Job) => ({
			...current,
			...newJob
		}));
	}

	const handleLevelChange = (_event: Electron.Event, newLevel: Job) => {
		setJob((current: Job) => ({
			...current,
			level: newLevel.level,
			current_xp: newLevel.current_xp,
			max_xp: newLevel.max_xp
		}));
	}

	const handleXpChange = (_event: Electron.Event, newXp: number) => {
		setJob((current: Job) => ({
			...current,
			current_xp: newXp
		}));
	}

	useEffect(() => {
		getJobInfo();

		onReceive(`update:job-${type}`, handleJobChange);
		onReceive("update:level", handleLevelChange);
		onReceive("update:xp", handleXpChange);
		onReceive("broadcast:tcp-connected", getJobInfo);

		return () => {
			window.ipcRenderer.removeListener(`update:job-${type}`, handleJobChange)
			window.ipcRenderer.removeListener("update:level", handleLevelChange);
			window.ipcRenderer.removeListener("update:xp", handleXpChange);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", getJobInfo);
		};
	}, []);

	return (
		<div className="relative grid grid-cols-[70px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img
				className="col-start-1 col-end-2 row-start-1 row-end-3"
				src={JobIcons[job.job_name.toLowerCase().replace(" ", "-")]}
			/>
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {job.level}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2 
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">{job.job_name[0]}</span>
				<span className="text-3xl">{job.job_name.slice(1).toLowerCase()}</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={job.current_xp} maxXP={job.max_xp} />
			</div>
		</div>
	);
};

export default JobDisplay;