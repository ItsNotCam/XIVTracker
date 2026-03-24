import React from 'react';
import DropSource from '@components/recipes/DropSource';
import { TCDropSource } from '@xiv-types';

interface DropSourcesProps {
	data: TCDropSource[];
}

const DropSources: React.FC<DropSourcesProps> = ({ data }) => (
	<div>
		<h1 className="text-md text-custom-text-secondary-500">Drop Locations</h1>
		<ol className="flex flex-col max-h-80 overflow-auto">
			{data.map(source => <DropSource	key={crypto.randomUUID()} source={source}/>)}
		</ol>
	</div>
);

export default DropSources;