import { toTitleCase } from "@ui/util";
import { useStore } from "@ui/store/store";

const LocationDisplay: React.FC = () => {
	const { location } = useStore();

	return (
		<ul className="flex flex-row gap-2">
			{/* {location?.region    ? <li className="opacity-50">{toTitleCase(location?.region.name    || "")}</li> : null} */}
			{location?.territory ? <li className="opacity-50">{toTitleCase(location?.territory.name || "")}</li> : null} 
			<li className="opacity-50">•</li>
			{location?.area      ? <li>{toTitleCase(location?.area.name  || "")}</li> : null}
			<li className="opacity-50">•</li>
			{location?.subArea   ? <li className="opacity-50">{toTitleCase(location?.subArea.name || "")}</li> : null}
		</ul>
	);
};

export default LocationDisplay;
