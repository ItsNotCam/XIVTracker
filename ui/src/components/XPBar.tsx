import React from 'react';

interface XPBarProps {
	currentXP: number;
	maxXP: number;
}

const XPBar: React.FC<XPBarProps> = ({ currentXP, maxXP }) => (
	<div className="flex flex-col gap-[0.4rem] ml-[0.4rem]">
		<div className="bg-custom-gray-200 rounded-full">
			<div style={{
				width: `${(currentXP / maxXP) * 100}%`
			}} className="h-1 bg-gradient-xp-horizontal rounded-l-full w-full transition-[width]" />
		</div>
		<h1 className='text-custom-text-secondary-100 bloom'>
			EXP {currentXP.toLocaleString()} / {maxXP.toLocaleString()}
		</h1>
	</div>
)

export default XPBar;