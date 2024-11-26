import { useEffect, useState, FC } from "react";
import { invoke, onReceive, toTitleCase } from "@ui/util/util";

interface Location {
	territory: { id: string | undefined; name: string | undefined };
	area: { id: string | undefined; name: string | undefined };
	subarea: { id: string | undefined; name: string | undefined };
	region: { id: string | undefined; name: string | undefined };
	housing_ward?: string;
	position?: string;
}


const LocationDisplay: FC = () => {
	const [location, setLocation] = useState<Location>({
			territory: { id: "undefined", name: undefined },
			area: { id: "undefined", name: undefined },
			subarea: { id: "undefined", name: undefined },
			region: { id: "undefined", name: undefined },
			housing_ward: undefined,
			position: undefined
	});

	const askLocation = () => {
		invoke("ask:location-all").then((newLocation: Location) => {
			setLocation((currentLocation: Location) => ({
				...currentLocation,
				...newLocation
			}));
		});
	}

	useEffect(() => {
		askLocation();

		const handleLocationChangeRef = (_event: any, newLocation: Location) => {
			setLocation((currentLocation: Location) => ({
				...currentLocation,
				...newLocation
			}));
		};

		onReceive("broadcast:tcp-connected", askLocation);
		onReceive("update:location-*", handleLocationChangeRef);
		onReceive("update:location-all", handleLocationChangeRef);
		return () => {
			window.ipcRenderer.removeListener("update:location-*", handleLocationChangeRef);
			window.ipcRenderer.removeListener("update:location-all", handleLocationChangeRef);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", askLocation);
		};
	}, []);

	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2 
			border-custom-gray-200 pr-6 flex flex-col 
			justify-center my-auto text-lg max-[700px]:hidden
		`}>
			{location.region ? <li>{toTitleCase(location.region.name || "")}</li> : null}
			{location.territory ? <li>{toTitleCase(location.territory.name || "")}</li> : null}
			{location.area ? <li>{toTitleCase(location.area.name || "")}</li> : null}
			{location.subarea ? <li>{toTitleCase(location.subarea.name || "")}</li> : null}
		</ul>
	);
};

export default LocationDisplay;