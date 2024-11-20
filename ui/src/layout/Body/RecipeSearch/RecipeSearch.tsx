import './recipe-search.css';

import React, { useEffect, useRef } from 'react';
import SearchBar from './SearchBar';

import { JobIconList } from '@ui/assets/images/jobs';
import { invoke, toTitleCase } from '@ui/util/util';

const RecipeSearch: React.FC = () => {
	const reqs = useRef<any[]>([])
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const [isSearching, setIsSearching] = React.useState(false);
	const [recipeData, setRecipeData] = React.useState<TCRecipe | null>(null);
	const [craftingRequirements, setCraftingRequirements] = React.useState<any[]>([]);
	const [recentSearches, setRecentSearches] = React.useState<any>();

	useEffect(() => {
		const getRecentSearches = async () => {
			const recentSearches = await invoke("ask:recent-recipe-searches");
			console.log(recentSearches);
			setRecentSearches(recentSearches);
		}
		getRecentSearches();
	}, [craftingRequirements])

	const handleSearch = (recipeName: string) => {
		if(isSearching) {
			return;
		}

		const isSearchingTimeout = setTimeout(() => {
			setIsSearching(true);
		}, 200);


		if(timeoutRef.current) clearTimeout(timeoutRef.current);

		timeoutRef.current = setTimeout(() => {
			setIsSearching(false);
		}, 2000);

		window.ipcRenderer.invoke('ask:recipe', recipeName).then(async(response: TCRecipe | null) => {
			setIsSearching(false);
			onSearchComplete(response);
		}).catch(() => {
			if(timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
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

	const onSearchComplete = async (result: TCRecipe | null) => {
		if (result !== null && result.name === recipeData?.name) {
			return;
		}

		setRecipeData(result);
		if (result) {
			reqs.current = [
				{ job: result.crafting?.job_name, level: result.crafting?.level, icon_path: JobIconList[result.crafting?.job_name || ""] }
			]

			await getAllCraftingRequirements(result);
			setCraftingRequirements(reqs.current);
		}
	}

	const getAllCraftingRequirements = async (recipeData: TCRecipe) => {
		recipeData.ingredients.forEach((ingredient: TCRecipe) => {
			const level = recipeData.crafting?.level;
			const crafting = ingredient.crafting;
			const gathering = ingredient.gathering;
			if (crafting && level && level > 1) {
				let changed = false;
				reqs.current.forEach((curJob) => {
					if (curJob.job === crafting?.job_name) {
						curJob = {
							...curJob,
							level: Math.max(curJob.level, level)
						}
						changed = true;
					}
				})

				if (!changed) {
					reqs.current.push({
						job: crafting?.job_name,
						level: crafting?.level,
						icon_path: JobIconList[crafting.job_name]
					});
				}
			}
			if (gathering && gathering.level > 1) {
				const level = gathering.level;
				gathering.types?.forEach((t: TCGatheringType) => {
					console.log(`UNDEFINED asfoiugsaviydfkjlk '${t.name}'`, JobIconList[t.name])
					let jobname = ""
					if (t.name === "Mining" || t.name === "Quarrying") {
						jobname = "miner";
					} else {
						jobname = "botanist";
					}

					let changed = false;
					reqs.current.forEach((curJob) => {
						if (curJob.job === jobname) {
							curJob = {
								...curJob,
								level: Math.max(curJob.level, level)
							}
							changed = true;
						}
					})

					if (!changed) {
						reqs.current.push({ job: jobname, level: level || -1, icon_path: JobIconList[jobname] });
					}
				});
			}
			if (ingredient.ingredients && ingredient.ingredients.length > 0) {
				getAllCraftingRequirements(ingredient);
			}
		});
	}

	return (
		<>
			<div className="flex flex-row justify-between items-center p-4">
				<h1 className="text-content-header">CRAFTING</h1>
				<SearchBar handleSearch={handleSearch} isSearching={isSearching} />
			</div>
			<div className="grid grid-cols-[auto,1fr] max-h-full">
				{recentSearches && recentSearches.length > 0 && (
					<ul className="w-auto ml-4 overflow-y-auto overflow-x-hidden">
						{recentSearches.map((search: any) => (
							<li title={search.recipe.name} className="hover:scale-[110%] transition-transform cursor-pointer flex flex-row gap-2 items-center p-2 h-[64px] w-[64px]" onClick={() => {
								handleSearch(search.recipe.name);
							}}>
								<img src={search.recipe.icon_path}/>
							</li>
						))}
					</ul>
				)}
				{recipeData === null && (
					<h1 className="3xl text-center mt-8">Search for a recipe to get started</h1>
				)}
				{recipeData && (
				<div className="overflow-y-auto px-4 pb-4">
					<div className="flex flex-row gap-4 items-center max-[850px]:flex-wrap">
						<img src={recipeData?.icon_path} className="max-w-[4.3rem]" alt="Recipe Icon" />
						<div className="font-forum max-w-[15rem] flex-grow">
							<h1 className='text-3xl'>{recipeData?.name}</h1>
							<div className="text-2xl forum flex flex-row gap-2">
								<img src={JobIconList[recipeData?.crafting?.job_name || ""]} className="h-[1.2em] w-[1.2em] inline" />
								<p>Lvl. {recipeData?.crafting?.level}</p>
							</div>
						</div>
						<div className="crafting-requirement-container flex flex-wrap flex-row gap-2 overflow-visible z-10">
							{craftingRequirements?.map((req) => (
								<div key={`crafting-req-${req.job}`} className="grid place-items-center group flex-grow-0 group" title={toTitleCase(req.job)}>
									<h1 className='absolute overflow-visible grid-centered z-[1] group-hover:opacity-100 opacity-0 transition-opacity duration-100 translate-y-14 hidden group-hover:block'>
										Lvl. {req.level}<br/>
										{toTitleCase(req.job)}
									</h1>
									<img src={req.icon_path} className="grid-centered h-[64px] w-[64px]" />
									<div className="h-[80%] w-[80%] bg-black/40 group-hover:bg-black/0 grid place-items-center grid-centered rounded-lg transition-colors duration-100">
										<h1 className="text-2xl pointer-events-none group-hover:opacity-0 opacity-100 transition-opacity" style={{
											color: Math.random() > 0.5 ? 'lime' : 'red'
										}}>{req.level}</h1>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="">
					</div>
				</div>
				)}
			</div>
		</>);
};

export default RecipeSearch;
