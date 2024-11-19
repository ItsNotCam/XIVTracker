import { TCRecipe } from '@electron/libs/providers/RecipeProviderTypes';
import React from 'react';

export interface SearchBarProps {
	onSearchComplete: (recipe: TCRecipe | null) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchComplete }) => {
	
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const [isSearching, setIsSearching] = React.useState(false);
	const [searchError, setSearchError] = React.useState<string | null>(null);

	const handleSearch = async(event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if(isSearching) {
			return;
		}

		const isSearchingTimeout = setTimeout(() => {
			setIsSearching(true);
		}, 200);

		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const recipeName = formData.get('recipe-search-name');

		if(timeoutRef.current) clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			setIsSearching(false);
		}, 2000);

		window.ipcRenderer.invoke('ask:recipe', recipeName).then(async(response: TCRecipe | null) => {
			setIsSearching(false);
			onSearchComplete(response);
		}).catch((error: Error) => {
			if(timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			setSearchError(error.message);
			setIsSearching(false);
		}).finally(() => {
			if(timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				setIsSearching(false);
			}
			if(isSearchingTimeout) {
				clearTimeout(isSearchingTimeout);
			}
		});
	}

	const SearchButtonIcon: React.FC<{ className?: string }> = ({ className }) => (
		<svg xmlns="http://www.w3.org/2000/svg" className={className} height="1.5rem" viewBox="0 -960 960 960" width="1.5rem">
			<path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/>
		</svg>
	)

	const LoadingIcon: React.FC<{ className?: string }> = ({ className }) => (
		<svg xmlns="http://www.w3.org/2000/svg" className={className} height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="#e8eaed">
			<path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z"/>
		</svg>
	)

	return (
		<form onSubmit={handleSearch} className="
			w-[clamp(200px,60%,400px)] rounded-full bg-custom-gray-900 
			text-white flex flex-row gap-2 items-center
		">
				<svg xmlns="http://www.w3.org/2000/svg" className="fill-custom-gray-100/50 ml-3 my-2" height="24px" viewBox="0 -960 960 960" width="24px" >
					<path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
				</svg>
				<input type="text" className="bg-transparent outline-none focus:outline-none flex-grow" name="recipe-search-name"/>
				<button disabled={isSearching} className='cursor-pointer h-8 w-8 hover:bg-custom-gray-300 rounded-full grid place-items-center mr-2 group'>
					{isSearching 
						? <LoadingIcon className="animate-spin" /> 
						: <SearchButtonIcon className='fill-custom-gray-100 group-hover:ml-1 transition-[margin]'/>}
				</button>
		</form>
	);
};

export default SearchBar;