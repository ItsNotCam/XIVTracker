import React from 'react';
import XPBar from '@components/ui/XPBar';
import { JobIconList } from '@assets/images/jobs';
import { useStore } from '@ui/store/store';

const JobDisplay: React.FC = () => {
	const { job } = useStore();
	
	return (
		<div className="relative grid grid-cols-[70px_1fr] grid-rows-[auto_1fr_auto] h-full w-75 p-4">
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
				<XPBar />
			</div>
		</div>
	);
};

export default JobDisplay;
