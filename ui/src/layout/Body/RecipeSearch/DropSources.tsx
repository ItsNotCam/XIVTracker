import { locAxisString, toTitleCase } from '@ui/util/util';
import React from 'react';

interface DropSourcesProps {
	data: TCDropSource[];
}

const Position: React.FC<{ pos: TCPosition }> = ({ pos }) => {
	return (
		<div className="grid grid-cols-[5rem,1fr,auto,auto] gap-2 hover:bg-custom-gray-200">
			<h1>Lvl. {pos.level}</h1>
			<h1>{pos.map_name}</h1>
			<h1>x: {locAxisString(pos.x)}</h1>
			<h1>y: {locAxisString(pos.y)}</h1>
		</div>
	)
}

const DropSources: React.FC<DropSourcesProps> = ({ data }) => {
	return (
		<div>
			<h1 className="text-md text-custom-text-secondary-500">Drop Locations</h1>
			<ol className="flex flex-col max-h-[20rem] overflow-auto">
				{data.map((source) => (
					<li className="border-t border-custom-gray-200 mx-2 ">
						<h1 className="sticky top-0 bg-custom-gray-500 border-b border-custom-gray-200 text-custom-text-secondary-100">
							{toTitleCase(source?.name)}
						</h1>
						{source.positions?.map(pos => (<Position pos={pos}/>))}
					</li>
				))}
			</ol>
		</div>
	);
};

export default DropSources;