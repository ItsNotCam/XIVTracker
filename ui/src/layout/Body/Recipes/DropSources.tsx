import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import DropSource from '../../../components/recipes/DropSource';

interface DropSourcesProps {
	data: TCDropSource[];
}

const DropSources: React.FC<DropSourcesProps> = ({ data }) => (
	<div>
		<h1 className="text-md text-custom-text-secondary-500">Drop Locations</h1>
		<ol className="flex flex-col max-h-[20rem] overflow-auto">
			{data.map(source => <DropSource	key={uuidv4()} source={source}/>)}
		</ol>
	</div>
);

export default DropSources;