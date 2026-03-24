import React, { useState } from 'react';
import Sidebar from '@ui/layout/Body/Sidebar';
import RecipeSearch from './Recipes/Recipes';
import Jobs from './Jobs/Jobs';

const pages: JSX.Element[] = [
	<RecipeSearch />,
	<Jobs />,
	<h1 className="text-content-header">Goals</h1>
];

const Body: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<number>(0);

	return (
		<section className="h-[calc(100vh-180px)] flex flex-row">
			<nav>
				<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab}/>
			</nav>
			{pages.map((page: JSX.Element, i: number) => (
				<div 
					key={crypto.randomUUID()} 
					className="bg-custom-gray-500 grow" 
					style={{ display: currentTab === i ? 'block' : 'none' }}
				>
					{page}
				</div>
			))}
		</section>
	);
};

export default Body;