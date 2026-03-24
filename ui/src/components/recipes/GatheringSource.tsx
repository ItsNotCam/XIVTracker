import { locAxisString } from '@ui/util/util';
import React from 'react';


const GatheringSource: React.FC<{ location: TCGatheringNode }> = ({ location }) => (
	<li 
		key={crypto.randomUUID()} 
		className="border-t border-custom-gray-200 grid 
		grid-cols-[5rem_10rem_auto_4.5rem_4.5rem] gap-2 px-2 
		items-center hover:bg-custom-gray-200"
	>
		<h1>Lvl. {location.level}</h1>
		<h1>{location.map_name}</h1>
		<h1>{location.zone_name}</h1>
		<h1>x: {locAxisString(location.x)}</h1>
		<h1>y: {locAxisString(location.y)}</h1>
	</li>
);

export default GatheringSource;