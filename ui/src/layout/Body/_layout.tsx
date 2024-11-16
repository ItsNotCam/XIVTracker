import React, { useState } from 'react';
import Sidebar from '@ui/layout/Body/Sidebar';
import RecipeSearch from '@ui/layout/Body/RecipeSearch/RecipeSearch';

const pages: JSX.Element[] = [
	<RecipeSearch />,
	<h1 className="text-content-header">Goals</h1>,
	<h1 className="text-content-header">Jobs</h1>
];

const Body: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<number>(0);

	return (
		<main className="grid grid-cols-[auto,1fr] grid-rows-1 h-[calc(100vh-180px)]">
			<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab}/>
			<div className="bg-custom-gray-500 grid grid-rows-[auto,1fr] grid-cols-1">
				{pages[currentTab]}
			</div>
		</main>
	);
};

export default Body;