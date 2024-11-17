import React from 'react';
import { withCommas } from '@ui/util/util';

interface XPBarProps {
	currentXP: number;
	maxXP: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP }) => {
	return (
	<div className="flex flex-col gap-[0.4rem] ml-[0.4rem]">
		<div className="bg-custom-gray-200 rounded-full">
			<div style={{
				width: `${(currentXP / maxXP) * 100}%`
			}} className="h-[0.25rem] bg-gradient-xp-horizontal rounded-l-full w-full transition-[width]" />
		</div>
		<h1 className='text-custom-text-secondary-100 bloom'>
			EXP {withCommas(currentXP)} / {withCommas(maxXP)}
		</h1>
	</div>);
};

export default XPBar;