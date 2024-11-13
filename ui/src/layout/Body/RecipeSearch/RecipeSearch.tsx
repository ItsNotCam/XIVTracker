import React from 'react';

const RecipeSearch: React.FC = () => {
	const handleRecipeSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	}

	const SearchButtonIcon: React.FC<{ className?: string }> = ({ className }) => (
		<svg xmlns="http://www.w3.org/2000/svg" className={className} height="1.5rem" viewBox="0 -960 960 960" width="1.5rem">
			<path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
		</svg>
	)

	return (
		<div className="flex flex-row justify-between items-center">
			<h1 className="text-content-header">CRAFTING</h1>
			<form onSubmit={handleRecipeSearch} className="
				w-[clamp(200px,60%,400px)] rounded-full bg-custom-gray-900 
				text-white flex flex-row gap-2 items-center
			">
					<svg xmlns="http://www.w3.org/2000/svg" className="fill-custom-gray-100/50 ml-3 my-2" height="24px" viewBox="0 -960 960 960" width="24px" >
						<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
					</svg>
					<input type="text" className="bg-transparent outline-none focus:outline-none flex-grow"/>
					<button className='cursor-pointer h-8 w-8 hover:bg-custom-gray-300 rounded-full grid place-items-center mr-2 group'>
						<SearchButtonIcon className='fill-custom-gray-100 group-hover:ml-1 transition-[margin]'/>
					</button>
			</form>
		</div>
	);
};

export default RecipeSearch;