import React, { useState } from 'react';
import Sidebar from '@ui/layout/Sidebar';
import PageContentBody from '@layout/page-content/PageContentBody';
import RecipeSearch from '@layout/page-content/recipe-search/RecipeSearch';

const pages: JSX.Element[] = [
	<RecipeSearch />,
	<h1 className="text-content-header">Goals</h1>,
	<h1 className="text-content-header">Jobs</h1>
];

const PageContent: React.FC = () => {
	const [currentTab, setCurrentTab] = useState<number>(0);

	return (
		<div className="w-full flex flex-row flex-grow">
			<Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab}/>
			<PageContentBody>
				{pages[currentTab]}
			</PageContentBody>
		</div>
	);
};

export default PageContent;