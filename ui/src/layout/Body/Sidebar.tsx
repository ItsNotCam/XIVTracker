import React from 'react';
import { useStore } from '@ui/store/store';
import { pages } from '../layout';


interface SidebarProps {
	className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
	const { currentPageIdx, setCurrentPageIdx } = useStore();
	
	return (
	<ul className={`w-20 shrink-0 ${className || ""}`}>
		{Object.values(pages).map((tab, index) => (
			<li
				key={crypto.randomUUID()} 
				onClick={() => setCurrentPageIdx(index)}
				className={`
					outline-none focus:outline-none cursor-pointer py-2 px-4 transition-colors 
					duration-100 hover:bg-custom-gray-500 ${currentPageIdx === index && " bg-custom-gray-500"}
				`}
			>
				<img className="w-14 mx-auto" src={tab.icon}/>
			</li>
		))}
	</ul>
)};

export default Sidebar;