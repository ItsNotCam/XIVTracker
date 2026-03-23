import { toTitleCase } from "@ui/util/util";
import { useStore } from "@ui/store/store";

const LocationDisplay: React.FC = () => {
	const { location } = useStore();

	return (
		<ul className={`h-8/10 text-right mr-6 border-r-2
			border-custom-gray-200 pr-6 flex flex-col
			justify-center my-auto text-lg max-[700px]:hidden
		`}>
			{location?.region    ? <li>{toTitleCase(location?.region.name    || "")}</li> : null}
			{location?.territory ? <li>{toTitleCase(location?.territory.name || "")}</li> : null}
			{location?.area      ? <li>{toTitleCase(location?.area.name      || "")}</li> : null}
			{location?.subArea   ? <li>{toTitleCase(location?.subArea.name   || "")}</li> : null}
		</ul>
	);
};

export default LocationDisplay;
