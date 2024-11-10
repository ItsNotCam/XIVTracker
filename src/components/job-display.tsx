import React, { useEffect } from 'react';
import XPBar from './xp-bar';
import { JobState } from '../../lib/structs';

interface JobDisplayType {
	type: "crafting" | "combat"
}

const JobDisplay: React.FC<JobDisplayType> = ({ type }) => {
	const [job, setJob] = React.useState<JobState>({
		level: 0,
		job_name: 'conjurer',
		current_xp: 0,
		max_xp: 0
	});

	const getMainJobInfo = () => {
		window.ipcRenderer.invoke("get-main-job-info").then((data: JobState | undefined) => {
			if(data === undefined) {
				setJob({ level: 0, job_name: "conjurer", current_xp: 0, max_xp: 0 });
				
				setTimeout(() => {
					getMainJobInfo();
				}, 5000);

			} else {
				console.log("job data:", data);
				setJob(data);
			}
		}).catch(e => {});
	}

	useEffect(() => {
		// getMainJobInfo();
		window.ipcRenderer.send("renderer-ready");
		window.ipcRenderer.on('setup-completed', (_event: any) => {
			getMainJobInfo();
		});
	},[]);

	return (
		<div className="relative grid grid-cols-[64px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img 
				className="col-start-1 col-end-2 row-start-1 row-end-3"
				src={`/images/job-${job.job_name.toLowerCase()}.png`} 
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
				<XPBar currentXP={job.current_xp} maxXP={job.max_xp}/>
			</div>
		</div>
	);
};

export default JobDisplay;