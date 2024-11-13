import React from 'react';
import Clock from '@ui/layout/header/TimeDisplay';
import LocationDisplay from '@ui/layout/header/LocationDisplay';
import NameDisplay from '@ui/layout/header/NameDisplay';
import JobDisplay from '@ui/components/JobDisplay';

const Header: React.FC = () => {
	return (
		<div className="grid grid-cols-[auto,1fr,auto]">
			<JobDisplay type="main"/>
			<LocationDisplay />
			<div className="flex flex-col justify-center items-center ml-auto">
				<Clock />
				<NameDisplay />
			</div>
		</div>
	);
};

export default Header;