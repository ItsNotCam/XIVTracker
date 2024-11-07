import React from 'react';
import JobDisplay from '../components/job-display';
import Clock from '../components/time-display';
import LocationDisplay from '../components/location-display';
import NameDisplay from '../components/name-display';

const Header: React.FC = () => {
	return (
		<header className="bg-custom-gray-500 grid grid-cols-[auto,1fr,auto] shadow-md">
			<JobDisplay type="combat"/>
			<LocationDisplay />
			<div className="flex flex-col justify-center items-center ml-auto">
				<Clock />
				<NameDisplay />
			</div>
		</header>
	);
};

export default Header;