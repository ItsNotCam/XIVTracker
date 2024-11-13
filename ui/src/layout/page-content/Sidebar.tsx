import React from 'react';

import CraftingImage from '@assets/images/tabs/tabs-search.png';
import GoalsImage from '@assets/images/tabs/tabs-goals.png';
import JobsImage from '@assets/images/tabs/tabs-jobs.png';

const tabs = [
	{ name: "Crafting", src: CraftingImage },
	{ name: "Goals", src: GoalsImage },
	{ name: "Jobs", src: JobsImage },
]

interface SidebarProps {
	setCurrentTab: (index: number) => void;
	currentTab: number;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentTab, currentTab }) => {
	return (
		<div className="flex flex-col w-fit">
			{tabs.map((tab, index) => (
				<button  
					key={`tab-${tab.name}`} 
					onClick={() => setCurrentTab(index)}
					className={`
						cursor-pointer py-2 px-4 transition-colors duration-100 hover:bg-custom-gray-500
						${currentTab === index && " bg-custom-gray-500"}
					`}
				>
					<img className="w-[56px] mx-auto" src={tab.src}/>
				</button>
			))}
		</div>
	);
};

export default Sidebar;