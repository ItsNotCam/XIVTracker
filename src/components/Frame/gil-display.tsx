import React, { useEffect } from 'react';
import { withCommas } from '../../util/util';

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState(3250);

  useEffect(() => {
		// window.ipcRenderer.on('')
	}, []);
	
	return (
		<div className="flex flex-row gap-1 items-center font-fanwood text-2xl text-custom-text-secondary-500">
			<span className="mb-1">{withCommas(amount)}</span>
			<span><img className="h-7" src="/public/images/etc-gil.png" /></span>
		</div>
	);
};

export default GilDisplay;	