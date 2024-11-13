import { onReceive, unregister } from "@lib/eventHelpers";
import { useEffect, useState } from "react";

interface Location {
	territory: string;
	area: string;
	subarea: string;
}


export default function LocationDisplay(): JSX.Element {
	const [location, setLocation] = useState<Location>({
		territory: "La Noscea",
		area: "Limsa Lominsa Lower Docks",
		subarea: "East Hakwers' Alley"
	})

	// const getLocation = () => {
	// 	window.ipcRenderer.invoke("get-location").then((data: Location | undefined) => {
	// 		if(data) {
	// 			setLocation(data);
	// 		} else {
	// 			setTimeout(getLocation, 100);
	// 		}
	// 	});
	// }

	const handleLocationChange = (_event: Electron.Event, newLocation: Location) => {
		setLocation((currentLocation: Location) => ({
			...currentLocation,
			...newLocation
		}))
	}
	
	useEffect(() => {
		onReceive("update:location-*", handleLocationChange);
		return () => {
			unregister("update:location-*", window.ipcRenderer, handleLocationChange);
		}
	},[])

	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2 
			border-custom-gray-200 pr-6 flex flex-col 
			justify-center my-auto text-lg
		`}>
			<li>{location.territory}</li>
			<li>{location.area}</li>
			<li>{location.subarea}</li>
		</ul>
	)
}