import { useStore } from '@ui/store/store';
import React from 'react';


const XPBar: React.FC = () => {
	const store = useStore();

	return (
		<div className='
			grid grid-cols-[auto_1fr_auto] gap-4 items-center h-10 
			py-2 px-4 border-b border-[hsl(42,45%,17%)]
		'>
			<span>{store.playerName}</span>
			<div className="bg-custom-gray-200 rounded-full">
				<div
					style={{ width: store.job ? `${(store.job.expCurrent / store.job.expMax) * 100}%` : 0 }}
					className="h-2 bg-gradient-xp-horizontal rounded-l-full w-full transition-[width]"
				/>
			</div>
			<p className='text-custom-text-secondary-100'>
				<span className='text-custom-text-primary-500 text-sm'>EXP</span>{" "}
				<span className="bloom">{store.job?.expCurrent.toLocaleString()}</span>{" "}
				<span className='text-custom-text-primary-500'>/{store.job?.expMax.toLocaleString()}</span>
			</p>
		</div>
	)
}

export default XPBar;