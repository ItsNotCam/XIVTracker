import React from 'react';

interface GatheringDataProps {
	data: TCGathering;
}


const GatheringData: React.FC<GatheringDataProps> = ({ data }) => {
	data.locations = data.locations.sort((a, b) => a.level - b.level);
	return (
		<div>
			<h1>Gathering Locations</h1>
			<ol className="flex flex-col max-h-[10rem] overflow-auto list-outside list-decimal">
				{data.locations.filter(loc => loc.map_name || loc.zone_name).map((loc) => (
					<li key={loc.base} className="border-t border-custom-gray-200 grid grid-cols-[5rem,1fr,1fr,15%,15%] gap-2 px-2 items-center hover:bg-custom-gray-200">
						<h1>Lvl. {loc.level}</h1>
						<h1>{loc.map_name}</h1>
						<h1>{loc.zone_name}</h1>
						<h1 className="mx-2">x: {loc.x.toFixed(2)}</h1>
						<h1 className="mx-2">y: {loc.y.toFixed(2)}</h1>
						{/* <h1>{loc.x}</h1>
						<h1>{loc.y}</h1> */}
					</li>
				))}
			</ol>
		</div>
	);
};

export default GatheringData;