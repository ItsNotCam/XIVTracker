import React from 'react';

import GilImage from "@assets/images/etc-gil.png";
import { useStore } from '@ui/store/store';

const GilDisplay: React.FC = () => {
	const { gil } = useStore();
	
	return (
		<div className="flex flex-row gap-1 items-center text-xl text-custom-text-secondary-500">
			<span>{gil.toLocaleString()}</span>
			<span><img className="h-7" src={GilImage} /></span>
		</div>
	);
};

export default GilDisplay;	