import { useEffect, useState } from "react";
import { invoke, addListener, removeListener } from '@ui/util/util';

const NameDisplay: React.FC = () => {
	const [name, setName] = useState<string>("???");

	const updateName = (_: any, newName: string) => setName(newName);
	const askName = async () => {
		let name = await invoke("name.get");
		setName(name);
	}

	useEffect(() => {
		askName();

		addListener(askName, "loggedIn");
		addListener(askName, "connection.changed");
		addListener(updateName, "name.changed");

		return () => {
			removeListener(updateName, "name.changed");
			removeListener(askName, "connection.changed");
			removeListener(askName, "loggedIn");
		}
	}, []);

	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase mr-6">
			{name ?? "???"}
		</h1>
	)
};

export default NameDisplay;
