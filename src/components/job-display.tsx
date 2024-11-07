import React, { useEffect } from 'react';
import XPBar from './xp-bar';

interface JobDisplayType {
	type: "crafting" | "combat"
}

interface JobState {
	level: number;
	jobName: string;
	currentXP: number;
	maxXP: number;
}

const JobDisplay: React.FC<JobDisplayType> = ({ type }) => {
	const [state, setState] = React.useState<JobState>({
		level: 0,
		jobName: '',
		currentXP: 0,
		maxXP: 0
	});

	useEffect(() => {
		window.ipcRenderer.invoke("get-main-job-info").then((data) => {
			const { level, jobName, currentXP, maxXP } = data;
			setState({ level, jobName, currentXP, maxXP });
		});
	},[]);

	return (
		<div className="relative grid grid-cols-[64px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img className="col-start-1 col-end-2 row-start-1 row-end-3" src={`/images/job-${state.jobName.toLowerCase()}.png`} />
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {state.level}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2 
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">{state.jobName[0]}</span>
				<span className="text-3xl">{state.jobName.slice(1).toLowerCase()}</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={state.currentXP} maxXP={state.maxXP}/>
			</div>
		</div>
	);
};

export default JobDisplay;