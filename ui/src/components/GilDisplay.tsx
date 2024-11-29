import React, { useEffect } from 'react';
import { invoke, onReceive, withCommas } from '@ui/util/util';

import GilImage from "@assets/images/etc-gil.png";

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState<string>("-");

	const updateGilAmount = (_: any, amount: number) => {
		setAmount(withCommas(amount));
	}

	const askCurrencies = async () => {
		const gil = await invoke("ask:currency-gil");
		if(!isNaN(gil)) {
			setAmount(withCommas(gil));
		}
	}

  useEffect(() => {	
		askCurrencies();

		onReceive("update:currency-gil", updateGilAmount);
		onReceive("broadcast:login", askCurrencies);
		onReceive("broadcast:tcp-connected", askCurrencies);

		return () => {
			window.ipcRenderer.removeListener("update:currency-gil", updateGilAmount);
			window.ipcRenderer.removeListener("broadcast:login", askCurrencies);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", askCurrencies);
		}
	}, []);
	
	return (
		<div className="flex flex-row gap-1 items-center text-xl text-custom-text-secondary-500">
			<span>{amount}</span>
			<span><img className="h-7" src={GilImage} /></span>
		</div>
	);
};

export default GilDisplay;	