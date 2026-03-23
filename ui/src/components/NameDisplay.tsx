import { useStore } from "@ui/store/store";
import { invoke } from "@ui/util/util";
import { useEffect } from "react";

const NameDisplay: React.FC = () => {
	const { name, isInitialized } = useStore();

	useEffect(() => {
		const interval = setInterval(() => {
			console.log("Store initialized?")
			if(isInitialized) updateSelf();
		}, 1000)
		
		const updateSelf = () => {
			console.log("ASKLING NAME")
			invoke("ask:name.get")
			clearInterval(interval);
		}

	}, [isInitialized]);

	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase mr-6">
			{name ?? "???"}
		</h1>
	)
};

export default NameDisplay;
