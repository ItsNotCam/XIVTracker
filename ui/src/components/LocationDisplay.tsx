import { useEffect, useState } from "react";
import { invoke, onReceive, toTitleCase } from "@ui/util/util";

const LocationDisplay: React.FC = () => {
	const [location, setLocation] = useState<XIVLocation>({
			territory: { id: "undefined", name: "" },
			area: { id: "undefined", name: "" },
			subarea: { id: "undefined", name: "" },
			region: { id: "undefined", name: "" },
			ward: undefined,
			position: undefined
	});

	const askLocation = async() => {
		const newLocation: XIVLocation = await invoke("ask:location-all");
		handleLocationChange(undefined, newLocation);
	}

	const handleLocationChange = (_: any, newLocation: XIVLocation) => {
		setLocation((currentLocation: XIVLocation) => ({
			...currentLocation,
			...newLocation
		}));
	};

	useEffect(() => {
		askLocation();

		onReceive("broadcast:login", askLocation);
		onReceive("broadcast:tcp-connected", askLocation);
		onReceive("update:location-*", handleLocationChange);

		return () => {
			window.ipcRenderer.removeListener("update:location-*", handleLocationChange);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", askLocation);
			window.ipcRenderer.removeListener("broadcast:login", askLocation);
		};
	}, []);

	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2 
			border-custom-gray-200 pr-6 flex flex-col 
			justify-center my-auto text-lg max-[700px]:hidden
		`}>
			{location.region 		? <li>{toTitleCase(location.region.name 		|| "")}	</li> : null}
			{location.territory ? <li>{toTitleCase(location.territory.name 	|| "")} </li> : null}
			{location.area 			? <li>{toTitleCase(location.area.name 			|| "")} </li> : null}
			{location.subarea 	? <li>{toTitleCase(location.subarea.name 		|| "")}	</li> : null}
		</ul>
	);
};

export default LocationDisplay;