import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import GatheringSource from './components/GatheringSource';

const GatheringSources: React.FC<{ data: TCGathering }> = ({ data }) => {
	data.locations = data.locations
		.filter(loc => loc.map_name || loc.zone_name)
		.sort((a, b) => a.level - b.level);

	return (
		<div>
			<h1 className="text-md text-custom-text-secondary-500">Gathering Locations</h1>
			<ol className="flex flex-col max-h-[10rem] overflow-auto">
				{data.locations.map(loc => <GatheringSource key={uuidv4()} location={loc} />)}
			</ol>
		</div>
	);
};

export default GatheringSources;