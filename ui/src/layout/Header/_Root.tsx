import React from 'react';
import Clock from '@ui/layout/Header/TimeDisplay';
import LocationDisplay from '@ui/layout/Header/LocationDisplay';
import NameDisplay from '@ui/layout/Header/NameDisplay';
import JobDisplay from '@ui/components/JobDisplay';

const Header: React.FC = () => {

	const initialJob: Job = {
		level: 0,
		job_name: 'conjurer',
		current_xp: 0,
		max_xp: 0
	};

	const initialTime: string = "00:00 PM";

	return (
		<section className="grid grid-cols-[auto,1fr,auto]">
			<JobDisplay type="main" initialJob={initialJob}/>
			<LocationDisplay />
			<div className="flex flex-col justify-center items-center ml-auto">
				<Clock initialTime={initialTime} />
				<NameDisplay />
			</div>
		</section>
	);
};

export default Header;