import React from 'react';
import Clock from './components/Header/time-display';
import LocationDisplay from './components/Header/location-display';
import NameDisplay from './components/Header/name-display';
import JobDisplay from './components/job-display';

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