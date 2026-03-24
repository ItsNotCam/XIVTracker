import { useStore } from "@ui/store/store";

const NameDisplay: React.FC = () => {
	const { name } = useStore();
	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase mr-6">
			{name ?? "???"}
		</h1>
	)
};

export default NameDisplay;
