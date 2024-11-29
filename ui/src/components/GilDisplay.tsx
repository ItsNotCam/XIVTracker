import React, { useEffect } from 'react';
import { onReceive, withCommas } from '@ui/util/util';

import GilImage from "@assets/images/etc-gil.png";

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState(3250);

	const updateGilAmount = (_: any, amount: number) => {
		setAmount(amount);
	}

  useEffect(() => {	
		onReceive("update:gil", updateGilAmount);
		return () => {
			window.ipcRenderer.removeListener("update:gil", updateGilAmount);
		}
	}, []);
	
	return (
		<div className="flex flex-row gap-1 items-center font-fanwood text-2xl text-custom-text-secondary-500">
			<span className="mb-1">{withCommas(amount)}</span>
			<span><img className="h-7" src={GilImage} /></span>
		</div>
	);
};

export default GilDisplay;	