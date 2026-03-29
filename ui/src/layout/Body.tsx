import ClockImage from '@assets/images/etc-clock.png';

import React from 'react';
import Sidebar from './Sidebar';
import XPBar from '@ui/components/ui/XPBar';
import TimeDisplay from '@ui/components/displays/TimeDisplay';
import LocationDisplay from '@ui/components/displays/LocationDisplay';
import JobDisplay from '@ui/components/displays/JobDisplay';


const Body: React.FC = () => (
	<div className='flex flex-row flex-1 min-h-0'>
		<Sidebar />

		{/* Center Section */}
		<div className='w-auto grow bg-[hsl(38,31%,5%)] h-full grid grid-rows-[7rem_auto_auto]'>

			{/* Job & Status Info */}
			<div className='
					flex flex-row justify-between items-center 
					border-b border-[hsl(42,45%,17%)] 
					bg-linear-to-r from-[hsl(42,43%,9%)] via-[hsl(38,31%,5%)] to-[hsl(38,31%,5%)]
				'>
				<JobDisplay />
				<div className="flex flex-col ml-auto items-end gap-2">
					<LocationDisplay />
					<TimeDisplay />
				</div>
				<img className="h-14 mx-2" src={ClockImage} />
			</div>

			<XPBar />

			{/* Main Content - Pages*/}
			<div></div>
		</div>
	</div>
)

export default Body;