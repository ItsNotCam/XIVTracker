import React from 'react';

const PageContentBody: React.FC<React.PropsWithChildren> = (props) => {
	return (
		<div className="flex-grow bg-custom-gray-500 h-full p-4">
			{props.children}
		</div>
	);
};

export default PageContentBody;