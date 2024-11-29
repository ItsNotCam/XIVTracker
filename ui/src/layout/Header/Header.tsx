import React from 'react';
import Clock from '@ui/components/TimeDisplay';
import LocationDisplay from '@ui/components/LocationDisplay';
import NameDisplay from '@ui/components/NameDisplay';
import JobDisplay from '@ui/components/JobDisplay';

const Header: React.FC = () => {
	return (
		<section className="grid grid-cols-[auto,1fr,auto]">
			<JobDisplay />
			<LocationDisplay />
			<div className="flex flex-col justify-center items-end ml-auto">
				<Clock />
				<NameDisplay />
			</div>
		</section>
	);
};

export default Header;