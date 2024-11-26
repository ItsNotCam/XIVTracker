import React, { useState } from 'react';
import Sidebar from '@ui/layout/Body/Sidebar';
import RecipeSearch from './RecipeSearch/_Root';

const pages: JSX.Element[] = [
	<RecipeSearch />,
	<h1 className="text-content-header">Goals</h1>,
	<h1 className="text-content-header">Jobs</h1>
];

const Body: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<number>(0);

	return (
		<section className="h-[calc(100vh-180px)] flex flex-row">
			<nav>
				<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab}/>
			</nav>
			{pages.map((page: any,i) => (
				<div className="bg-custom-gray-500 flex-grow" style={{ display: currentTab === i ? 'block' : 'none' }}>
					{page}
				</div>
			))}
		</section>
	);
};

export default Body;