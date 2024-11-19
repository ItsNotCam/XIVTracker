import { useEffect, useState, FC } from "react";

import { Location } from "@electron/libs/CommonTypes";
import { onReceive } from "@ui/util/util";


const LocationDisplay: FC<{ initialLocation: Location }> = ({ initialLocation: initialLocation }) => {
	const [location, setLocation] = useState<Location>(initialLocation);

	const handleLocationChange = (_event: any, newLocation: Location) => {
		setLocation((currentLocation: Location) => ({
			...currentLocation,
			...newLocation
		}));
	};

	useEffect(() => {
		const handleLocationChangeRef = handleLocationChange;

		onReceive("update:location-*", handleLocationChangeRef);
		return () => {
			window.ipcRenderer.removeListener("update:location-*", handleLocationChangeRef);
		};
	}, []);

	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2 
			border-custom-gray-200 pr-6 flex flex-col 
			justify-center my-auto text-lg
		`}>
			<li>{location.territory?.name}</li>
			<li>{location.area?.name}</li>
			<li>{location.sub_area?.name}</li>
		</ul>
	);
};

export default LocationDisplay;