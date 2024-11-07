import React, { useEffect } from 'react';
import XPBar from './xp-bar';

const JobDisplay: React.FC = () => {
	const [level, setLevel] = React.useState(33);
	const [job, setJob] = React.useState('CONJURER');
	const [currentXP, setCurrentXP] = React.useState(33000);
	const [maxXP, setMaxXP] = React.useState(55000);

	useEffect(() => {

	},[]);

	return (
		<div className="relative grid grid-cols-[64px,1fr] grid-rows-[auto,1fr,auto] h-full w-[300px] p-4">
			<img className="col-start-1 col-end-2 row-start-1 row-end-3" src="/images/job-conjurer.png" />
			<h2 className="text-custom-text-secondary-300 text-xl row-start-1 row-end-2 col-start-2 col-end-3 ml-[0.6rem]">
				LEVEL {level}
			</h2>
			<h1 className={`
				text-custom-text-secondary-500 text-3xl font-forum col-start-2 
				col-end-3 row-start-2 row-end-3 ml-2 uppercase
			`}>
				<span className="text-[2.55rem]">{job[0]}</span><span className="text-3xl">{job.slice(1).toLowerCase()}</span>
			</h1>
			<div className="col-span-2 mt-3">
				<XPBar currentXP={currentXP} maxXP={maxXP}/>
			</div>
		</div>
	);
};

export default JobDisplay;