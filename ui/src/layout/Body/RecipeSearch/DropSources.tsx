import { toTitleCase } from '@ui/util/util';
import React from 'react';

interface DropSourcesProps {
	data: TCDropSource[];
}

const Position: React.FC<{ pos: TCPosition }> = ({ pos }) => {
	return (
		<div className="grid grid-cols-[5rem,1fr,auto,auto] gap-2">
			<h1>Lvl. {pos.level}</h1>
			<h1>{pos.map_name}</h1>
			<h1 className="mx-2">x: {pos.x.toFixed(2)}</h1>
			<h1 className="mx-2">y: {pos.y.toFixed(2)}</h1>
		</div>
	)
}

const DropSources: React.FC<DropSourcesProps> = ({ data }) => {
	return (
		<div>
			<h1>Drop Locations</h1>
			<ol className="flex flex-col max-h-[20rem] overflow-auto list-outside list-decimal">
				{data.filter(loc => loc.positions !== null).map((loc) => (
					<li key={loc.name} className="border-t border-custom-gray-200 px-2 hover:bg-custom-gray-200">
						<h1 className="sticky top-0 bg-custom-gray-500 border-b border-custom-gray-200">
							{toTitleCase(loc.name)}
						</h1>
						{loc.positions.map(pos => (
							<Position pos={pos} />
						))}
					</li>
				))}
			</ol>
		</div>
	);
};

export default DropSources;