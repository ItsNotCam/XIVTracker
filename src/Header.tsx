import React from 'react';
import JobDisplay from './components/job-display';
import Clock from './components/clock';

const NameDisplay: React.FC = () => {
	return (<h1 className="text-3xl text-custom-text-secondary-300 uppercase">Cam Quat</h1>)
}

const LocationDisplay: React.FC = () => {
	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2 
			border-custom-gray-200 pr-6 flex flex-col 
			justify-center my-auto text-lg
		`}>
			<li>La Noscea</li>
			<li>Limsa Lominsa Lower Docks</li>
			<li>East Hakwers' Alley</li>
		</ul>
	)
}

const Header: React.FC = () => {
	return (
		<header className="bg-custom-gray-500 grid grid-cols-[auto,1fr,auto]">
			<JobDisplay />
			<LocationDisplay />
			<div className="flex flex-col justify-center items-center ml-auto">
				<Clock />
				<NameDisplay />
			</div>
		</header>
	);
};

export default Header;