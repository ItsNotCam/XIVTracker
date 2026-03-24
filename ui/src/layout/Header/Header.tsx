import React from 'react';
import LocationDisplay from '@components/displays/LocationDisplay';
import NameDisplay from '@components/displays/NameDisplay';
import JobDisplay from '@components/jobs/JobDisplay';
import Clock from '@components/displays/TimeDisplay';

const Header: React.FC = () => (
	<section className="grid grid-cols-[auto_1fr_auto]">
		<JobDisplay />
		<LocationDisplay />
		<div className="flex flex-col justify-center items-end ml-auto">
			<Clock />
			<NameDisplay />
		</div>
	</section>
);

export default Header;