import React, { useEffect } from 'react';
import { invoke, addListener, removeListener } from '@ui/util/util';

import GilImage from "@assets/images/etc-gil.png";

const GilDisplay: React.FC = () => {
	const [amount, setAmount] = React.useState<string>("-");

	const updateGilAmount = (_: any, amount: number) => {
		console.log("Updating Gil amount to", amount);
		setAmount(amount.toLocaleString());
	}

	const askCurrencies = async () => {
		const gil = await invoke("currency.get");
		if(!isNaN(gil)) {
			setAmount(gil.toLocaleString());
		}
	}

  useEffect(() => {	
		askCurrencies();

		addListener(updateGilAmount, "currency.changed");
		addListener(askCurrencies, "loggedIn");
		addListener(askCurrencies, "connection.changed");

		return () => {
			removeListener(updateGilAmount, "currency.changed");
			removeListener(askCurrencies, "loggedIn");
			removeListener(askCurrencies, "connection.changed");
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