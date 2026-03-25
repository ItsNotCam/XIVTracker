import React from 'react';
import Sidebar from '@ui/layout/Body/Sidebar';
import { useStore } from '@ui/store/store';
import { pages } from '../layout';

const Body: React.FC = () => {
	const { currentPageIdx } = useStore();

	return (
		<section className="h-[calc(100vh-180px)] flex flex-row">
			<nav>
				<Sidebar />
			</nav>
			{Object.values(pages).map((page, i) => (
				<div 
					key={crypto.randomUUID()} 
					className="bg-custom-gray-500 grow" 
					style={{ display: currentPageIdx === i ? 'block' : 'none' }}
				>
					{page.component}
				</div>
			))}
		</section>
	);
};

export default Body;