import React from 'react';
import Clock from '@ui/layout/Header/TimeDisplay';
import LocationDisplay from '@ui/layout/Header/LocationDisplay';
import NameDisplay from '@ui/layout/Header/NameDisplay';
import JobDisplay from '@ui/components/JobDisplay';
import { Job, Location } from '@electron/libs/types';

const Header: React.FC = () => {
	const initialLocation: Location = {
		territory: { id: "1", name: "La Noscea" },
		area: { id: "2", name: "Limsa Lominsa Lower Docks" },
		sub_area: { id: "3", name: "East Hakwers' Alley" },
		region: undefined,
		housing_ward: undefined,
		position: undefined
	};

	const initialJob: Job = {
		level: 0,
		job_name: 'conjurer',
		current_xp: 0,
		max_xp: 0
	};

	const initialTime: string = "00:00 PM";

	const initialName: string = "Cam Quat";

	return (
		<div className="grid grid-cols-[auto,1fr,auto]">
			<JobDisplay type="main" initialJob={initialJob}/>
			<LocationDisplay initialLocation={initialLocation}/>
			<div className="flex flex-col justify-center items-center ml-auto">
				<Clock initialTime={initialTime} />
				<NameDisplay initialName={initialName} />
			</div>
		</div>
	);
};

export default Header;