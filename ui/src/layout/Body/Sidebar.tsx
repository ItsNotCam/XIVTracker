import { CraftingImage, GoalsImage, JobsImage } from '@ui/assets/images/tabs';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

const tabs = [
	{ name: "Crafting", src: CraftingImage },
	{ name: "Jobs", src: JobsImage },
	{ name: "Goals", src: GoalsImage },
]

interface SidebarProps {
	setCurrentTab: (index: number) => void;
	currentTab: number;
	className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentTab, currentTab, className }) => (
	<ul className={`w-[80px] flex-shrink-0 ${className || ""}`}>
		{tabs.map((tab, index) => (
			<li
				key={uuidv4()} 
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

export default Sidebar;