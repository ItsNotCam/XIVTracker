import React from 'react';
import Clock from '@ui/layout/Header/TimeDisplay';
import LocationDisplay from '@ui/layout/Header/LocationDisplay';
import NameDisplay from '@ui/layout/Header/NameDisplay';
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