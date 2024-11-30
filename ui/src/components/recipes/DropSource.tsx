import Position from '@ui/components/recipes/Position';
import { toTitleCase } from '@ui/util/util';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const DropSource: React.FC<{source: TCDropSource}> = ({ source }) => {
	return (
		<li key={uuidv4()} className="border-t border-custom-gray-200 mx-2 ">
			<h1 className="sticky top-0 bg-custom-gray-500 border-b border-custom-gray-200 text-custom-text-secondary-100">
				{toTitleCase(source?.name)}
			</h1>
			{source.positions?.map(pos => <Position pos={pos}/>)}
		</li>
	);
};

export default DropSource;