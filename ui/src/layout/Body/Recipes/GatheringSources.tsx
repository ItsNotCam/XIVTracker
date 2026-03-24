import React from 'react';
import GatheringSource from '@components/recipes/GatheringSource';

const GatheringSources: React.FC<{ data: TCGathering }> = ({ data }) => {
	data.locations = data.locations
		.filter(loc => loc.map_name || loc.zone_name)
		.sort((a, b) => a.level - b.level);

	return (
		<div>
			<h1 className="text-md text-custom-text-secondary-500">Gathering Locations</h1>
			<ol className="flex flex-col max-h-40 overflow-auto">
				{data.locations.map(loc => <GatheringSource key={crypto.randomUUID()} location={loc} />)}
			</ol>
		</div>
	);
};

export default GatheringSources;