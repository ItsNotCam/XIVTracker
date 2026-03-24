import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface DropdownButtonProps {
	droppedDown: boolean;
	setDroppedDown: (droppedDown: boolean) => void
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ droppedDown, setDroppedDown }) => (
	<button 
		className="rounded-full p-1 hover:bg-custom-gray-200/50 transition-colors"
		onClick={() => { setDroppedDown(!droppedDown) }}
	>
		<ChevronLeftIcon className={
			`transition-transform 
			${droppedDown ? "-rotate-90" : "rotate-180"}`}
		/>
	</button>
);

export default DropdownButton;