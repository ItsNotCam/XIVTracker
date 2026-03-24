import { useStore } from '@ui/store/store';
import React, { useEffect, useState } from 'react';


const XPBar: React.FC = () => {
	const { job } = useStore();

	const [currentXp, setcurrentXp] = useState<number>(-1);
	const [maxXp, setMaxXp] = useState<number>(-1);

	useEffect(() => {
		if(!job) return;
		setcurrentXp(job.expCurrent);
		setMaxXp(job.expMax);
	}, [job])
	
	return (
		<div className="flex flex-col gap-[0.4rem] ml-[0.4rem]">
			<div className="bg-custom-gray-200 rounded-full">
				<div style={{
					width: `${(currentXp / maxXp) * 100}%`
				}} className="h-1 bg-gradient-xp-horizontal rounded-l-full w-full transition-[width]" />
			</div>
			<h1 className='text-custom-text-secondary-100 bloom'>
				EXP {currentXp.toLocaleString()} / {maxXp.toLocaleString()}
			</h1>
		</div>
	)
}

export default XPBar;