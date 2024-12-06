import { locAxisString } from '@ui/util/util';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const GatheringSource: React.FC<{ location: TCGatheringNode }> = ({ location }) => (
	<li 
		key={uuidv4()} 
		className="border-t border-custom-gray-200 grid 
		grid-cols-[5rem,10rem,auto,4.5rem,4.5rem] gap-2 px-2 
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