import { useEffect, useState } from "react";
import { invoke, addListener, removeListener, toTitleCase } from "@ui/util/util";

const LocationDisplay: React.FC = () => {
	const [location, setLocation] = useState<LocationModel>({
		position: { x: 0, y: 0, z: 0 },
		territory: { rowId: 0, name: "" },
		area: { rowId: 0, name: "" },
		subArea: { rowId: 0, name: "" },
		region: { rowId: 0, name: "" },
	});

	const askLocation = async() => {
		const newLocation: LocationModel = await invoke("location.getAll");
		handleLocationChange(undefined, newLocation);
	}

	const handleLocationChange = (_: any, newLocation: LocationModel) => {
		if (!newLocation) return;
		setLocation((currentLocation: LocationModel) => ({
			...currentLocation,
			...newLocation
		}));
	};

	useEffect(() => {
		askLocation();

		addListener(askLocation, "loggedIn");
		addListener(askLocation, "connection.changed");
		addListener(handleLocationChange, "location.changed");

		return () => {
			removeListener(handleLocationChange, "location.changed");
			removeListener(askLocation, "connection.changed");
			removeListener(askLocation, "loggedIn");
		};
	}, []);

	return (
		<ul className={`h-[80%] text-right mr-6 border-r-2
			border-custom-gray-200 pr-6 flex flex-col
			justify-center my-auto text-lg max-[700px]:hidden
		`}>
			{location.region    ? <li>{toTitleCase(location.region.name    || "")}</li> : null}
			{location.territory ? <li>{toTitleCase(location.territory.name || "")}</li> : null}
			{location.area      ? <li>{toTitleCase(location.area.name      || "")}</li> : null}
			{location.subArea   ? <li>{toTitleCase(location.subArea.name   || "")}</li> : null}
		</ul>
	);
};

export default LocationDisplay;
