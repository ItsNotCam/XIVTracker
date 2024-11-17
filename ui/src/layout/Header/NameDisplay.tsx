import { FC } from "react"

const NameDisplay: FC<{ initialName: string }> = ({ initialName }) => {
	

	return (
		<h1 className="text-3xl text-custom-text-secondary-300 uppercase">
			{initialName}
		</h1>
	)
};

export default NameDisplay;
