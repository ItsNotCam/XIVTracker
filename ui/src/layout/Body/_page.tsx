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
		<main className="w-full flex flex-row flex-grow">
			<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab}/>
			<div className="flex-grow bg-custom-gray-500 h-full p-4">
				{pages[currentTab]}
			</div>
		</main>
	);
};

export default Body;