import { useEffect, useState } from "react";
import { invoke, addListener, removeListener } from '@ui/util/util';

const NameDisplay: React.FC = () => {
	const [name, setName] = useState<string>("???");

	const updateName = (_: any, newName: string) => {	
		setName(newName);
	}

	const askName = async () => {
		let name = await invoke("ask:name");
		setName(name);
	}

	useEffect(() => {
		askName();

		addListener("broadcast:login", askName);
		addListener("broadcast:tcp-connected", askName);
		addListener("update:name", updateName);
		
		return () => {
			removeListener("update:name", updateName);
			removeListener("broadcast:tcp-connected", askName);
			removeListener("broadcast:login", askName);
		}
	}, []);

	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase mr-6">
			{name ?? "???"}
		</h1>
	)
};

export default NameDisplay;
