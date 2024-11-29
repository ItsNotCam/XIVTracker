import { FC, useEffect, useState } from "react";
import { invoke, onReceive } from '@ui/util/util';

const NameDisplay: FC = () => {
	const [name, setName] = useState<string>("???");

	const updateName = (_event: any, newName: string) => {	
		setName(newName);
	}

	const askName = async () => {
		let name = await invoke("ask:name");
		setName(name);
	}

	useEffect(() => {
		askName();

		onReceive("broadcast:login", askName);
		onReceive("broadcast:tcp-connected", askName);
		onReceive("update:name", updateName);
		
		return () => {
			window.ipcRenderer.removeListener("update:name", updateName);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", askName);
			window.ipcRenderer.removeListener("broadcast:login", askName);
		}
	}, []);

	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase mr-6">
			{(name && name.length > 0) ? name : "???"}
		</h1>
	)
};

export default NameDisplay;
