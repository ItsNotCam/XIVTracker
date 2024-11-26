import { locAxisString } from '@ui/util/util';
import React from 'react';

const GatheringSources: React.FC<{ data: TCGathering }> = ({ data }) => {
	data.locations = data.locations.sort((a, b) => a.level - b.level);
	return (
		<div>
			<h1 className="text-md text-custom-text-secondary-500">Gathering Locations</h1>
			<ol className="flex flex-col max-h-[10rem] overflow-auto">
				{data.locations.filter(loc => loc.map_name || loc.zone_name).map((loc) => (
					<li key={loc.base} className="border-t border-custom-gray-200 grid grid-cols-[5rem,10rem,auto,4.5rem,4.5rem] gap-2 px-2 items-center hover:bg-custom-gray-200">
						<h1>Lvl. {loc.level}</h1>
						<h1>{loc.map_name}</h1>
						<h1>{loc.zone_name}</h1>
						<h1>x: {locAxisString(loc.x)}</h1>
						<h1>y: {locAxisString(loc.y)}</h1>
					</li>
				))}
			</ol>
		</div>
	);
};

export default GatheringSources;