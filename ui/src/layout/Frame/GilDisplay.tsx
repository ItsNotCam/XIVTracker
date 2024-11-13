import React, { useEffect } from 'react';
import { IpcRendererEvent } from 'electron';
import { withCommas } from '@ui/util/util';

import GilImage from "@assets/images/etc-gil.png";
import { onReceive, unregister } from '@lib/eventHelpers';

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState(3250);

	const updateGilAmount = (_event: IpcRendererEvent, amount: number) => {
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