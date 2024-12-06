import { locAxisString } from '@ui/util/util';
import React from 'react';

const Position: React.FC<{ pos: TCPosition }> = ({ pos }) => (
	<div className="grid grid-cols-[5rem,1fr,auto,auto] gap-2 hover:bg-custom-gray-200">
		<h1>Lvl. {pos.level}</h1>
		<h1>{pos.map_name}</h1>
		<h1>x: {locAxisString(pos.x)}</h1>
		<h1>y: {locAxisString(pos.y)}</h1>
	</div>
)

export default Position;