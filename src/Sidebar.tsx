import React from 'react';

const tabs = [
	{ name: "Crafting", src: "/images/tabs/tabs-search.png" },
	{ name: "Goals", src: "/images/tabs/tabs-goals.png" },
	{ name: "Jobs", src: "/images/tabs/tabs-jobs.png" },
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