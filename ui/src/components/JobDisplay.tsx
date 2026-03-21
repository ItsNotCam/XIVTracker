import React, { useEffect } from 'react';
import XPBar from '@ui/components/XPBar';
import { JobIconList } from '@assets/images/jobs';
import { invoke, addListener, removeListener } from '@ui/util/util';

const JobDisplay: React.FC = () => {
	const [job, setJob] = React.useState<JobModel>({
		rowId: 0,
		name: "???",
		abbreviation: "???",
		level: 0,
		expCurrent: 0,
		expMax: 0
	});

	const validateJob = (job: JobModel): boolean => {
		return job &&
			typeof job.name === "string" &&
			typeof job.level === "number" &&
			typeof job.expCurrent === "number" &&
			typeof job.expMax === "number";
	}

	const getJobInfo = async() => {
		const result = await invoke("job.getCurrent");

		const isValidJob: boolean = validateJob(result as JobModel)
		if (isValidJob) {
			setJob(result as JobModel);
		} else {
			console.error(result, "Invalid JobModel received:");
			setJob({ rowId: 0, name: "???", abbreviation: "???", level: 0, expCurrent: 0, expMax: 0 });
		}
	}

	const handleJobChange = (_event: any, newJob: JobModel) => {
		setJob((current: JobModel) => ({
			...current,
			...newJob
		}));
	}

	const handleLevelChange = (_event: any, newLevel: JobModel) => {
		setJob((current: JobModel) => ({
			...current,
			level: newLevel.level,
			expCurrent: newLevel.expCurrent,
			expMax: newLevel.expMax
		}));
	}

	const handleXpChange = (_event: any, newXp: number) => {
		setJob((current: JobModel) => ({
			...current,
			expCurrent: newXp
		}));
	}

	useEffect(() => {
		getJobInfo();

		addListener(handleJobChange, "job.changed");
		addListener(handleLevelChange, "level.changed");
		addListener(handleXpChange, "xp.changed");
		addListener(getJobInfo, "connection.changed");
		addListener(getJobInfo, "loggedIn");

		return () => {
			removeListener(handleJobChange, "job.changed");
			removeListener(handleLevelChange, "level.changed");
			removeListener(handleXpChange, "xp.changed");
			removeListener(getJobInfo, "connection.changed");
			removeListener(getJobInfo, "loggedIn");
		};
	}, []);

	return (
		<div className="relative grid grid-cols-[70px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img
				className="col-start-1 col-end-2 row-start-1 row-end-3"
				src={job ? JobIconList[job.name.toLowerCase().replace(/ /g, "-")] : JobIconList["dark-knight"]}
			/>
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {job ? job.level : 0}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">
					{job ? job.name[0] : "u"}
				</span>
				<span className="text-3xl">
					{job ? job.name.slice(1).toLowerCase() : "ninitialized"}
				</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={job ? job.expCurrent : 0} maxXP={job ? job.expMax : 0} />
			</div>
		</div>
	);
};

export default JobDisplay;
