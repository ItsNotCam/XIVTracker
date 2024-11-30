import React, { useEffect } from 'react';
import { invoke, addListener, removeListener, withCommas } from '@ui/util/util';

import GilImage from "@assets/images/etc-gil.png";

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState<string>("-");

	const updateGilAmount = (_: any, amount: number) => {
		console.log("Updating Gil amount to", amount);
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

		addListener("update:currency-gil", updateGilAmount);
		addListener("broadcast:login", askCurrencies);
		addListener("broadcast:tcp-connected", askCurrencies);

		return () => {
			removeListener("update:currency-gil", updateGilAmount);
			removeListener("broadcast:login", askCurrencies);
			removeListener("broadcast:tcp-connected", askCurrencies);
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