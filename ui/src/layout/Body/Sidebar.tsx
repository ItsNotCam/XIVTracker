import { CraftingImage, GoalsImage, JobsImage } from '@ui/assets/images/tabs';
import React from 'react';

const tabs = [
	{ name: "Crafting", src: CraftingImage },
	{ name: "Goals", src: GoalsImage },
	{ name: "Jobs", src: JobsImage },
]

interface SidebarProps {
	setCurrentTab: (index: number) => void;
	currentTab: number;
	className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentTab, currentTab, className }) => {
	return (
		<ul className={`w-[80px] flex-shrink-0 ${className || ""}`}>
			{tabs.map((tab, index) => (
				<li  
					key={`tab-${tab.name}`} 
					onClick={() => setCurrentTab(index)}
					className={`
						outline-none focus:outline-none cursor-pointer py-2 px-4 transition-colors 
						duration-100 hover:bg-custom-gray-500 ${currentTab === index && " bg-custom-gray-500"}
					`}
				>
					<img className="w-[56px] mx-auto" src={tab.src}/>
				</li>
			))}
		</ul>
	);
};

export default Sidebar;