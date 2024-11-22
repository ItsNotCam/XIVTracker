import './recipe-search.css';

import React, { useEffect, useRef } from 'react';
import SearchBar from './SearchForm';

import { JobIconList } from '@ui/assets/images/jobs';
import { invoke, toTitleCase } from '@ui/util/util';
import CraftingItemReqs from './CraftItemReqs';
import RecipeTree from './RecipeTree';

const RecipeSearch: React.FC = () => {
	const reqs = useRef<any[]>([])
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const [isSearching, setIsSearching] = React.useState(false);
	const [recipeData, setRecipeData] = React.useState<TCRecipe | null>(null);
	const [craftingRequirements, setCraftingRequirements] = React.useState<any[]>([]);
	const [recentSearches, setRecentSearches] = React.useState<any>([]);
	const [favoriteRecipes, setFavoriteRecipes] = React.useState<string[]>([]);

	useEffect(() => {
		const getFavoriteRecipes = async () => {
			const favoriteRecipes = await invoke("ask:favorite-recipes");
			console.log("Favorite Recipes:", favoriteRecipes);
			setFavoriteRecipes(favoriteRecipes);
		}
		getFavoriteRecipes();

		return () => {
			setFavoriteRecipes([]);
		}
	}, []);

	useEffect(() => {
		const getRecentSearches = async () => {
			const recentSearches = await invoke("ask:recent-recipe-searches");
			setRecentSearches(recentSearches);
		}
		getRecentSearches();
	}, [craftingRequirements])

	const handleSearch = (recipeName: string) => {
		if(isSearching) {
			return;
		}

		const isSearchingTimeout = setTimeout(() => {
			setIsSearching(false);
		}, 200);

		if(timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		};
		timeoutRef.current = setTimeout(() => { setIsSearching(false); }, 2000);

		const getRecipe = async () => {
			setIsSearching(true);

			try {
				const result = await window.ipcRenderer.invoke('ask:recipe', recipeName);
				onSearchComplete(result);
			} catch(e: any) {
				console.error(e);
			} finally {
				if(timeoutRef.current) {
					clearTimeout(timeoutRef.current);
				}
				if(isSearchingTimeout) {
					clearTimeout(isSearchingTimeout);
				}
				setIsSearching(false);
			}
		}

		getRecipe();
	}

	const onSearchComplete = async (result: TCRecipe | null) => {
		if (result !== null && result.name === recipeData?.name) {
			console.log("invalid");
			return;
		}

		console.log("valid", result);
		if (result) {
			reqs.current = [{ 
				job: result.crafting?.job_name, 
				level: result.crafting?.level, 
				icon_path: JobIconList[result.crafting?.job_name || ""],
			}]

			await getAllCraftingRequirements(result);
			setRecipeData(result);
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
	
	const toggleFavoriteRecipe = async() => {
		if (recipeData === null) {
			return;
		}

		const isFavorite = await invoke("set:toggle-favorite-recipe", recipeData.name);
		if (isFavorite) {
			setFavoriteRecipes([...favoriteRecipes, recipeData.name]);
		} else {
			setFavoriteRecipes(favoriteRecipes.filter((r) => r !== recipeData.name));
		}
	}

	const toggleGoal = async() => {
		if (recipeData === null) {
			return;
		}

		const isFavorite = await invoke("set:toggle-favorite-recipe", recipeData.name);
		if (isFavorite) {
			setFavoriteRecipes([...favoriteRecipes, recipeData.name]);
		} else {
			setFavoriteRecipes(favoriteRecipes.filter((r) => r !== recipeData.name));
		}
	}


	return (<div className={`grid grid-rows-[72px] grid-cols-[75px,1fr] h-[calc(100vh-180px)] `}>
			<div className="flex flex-row justify-between items-center p-4 col-span-2">
				<h1 className="text-content-header">CRAFTING</h1>
				<SearchBar handleSearch={handleSearch} isSearching={isSearching} />
			</div>
			<ul className="overflow-y-auto overflow-x-hidden mx-auto border-custom-gray-200/50">
				{favoriteRecipes.map((search: any) => (
					<li title={search} className="transition-transform cursor-pointer flex flex-row gap-2 items-center p-2 h-[64px] w-[64px]" onClick={() => {
						handleSearch(search);
					}}>
						<img src={recipeData?.icon_path}/>
					</li>
				))}
			</ul>
			{recipeData === null ? (
				<h1 className="3xl text-center mt-8 h-fit">Search for a recipe to get started</h1>
			) : (
			<div className="mb-4 border-l-4 border-custom-gray-200/50">
				<CraftingItemReqs 
					craftingRequirements={craftingRequirements} 
					recipeData={recipeData} 
					isFavorite={favoriteRecipes.includes(recipeData.name)}
					toggleFavorite={toggleFavoriteRecipe}
					toggleGoal={toggleGoal}
				/>
				<div className='overflow-auto h-full'>
					<RecipeTree RecipeData={recipeData} IsFirst={true}/>
				</div>
			</div>
			)}
		</div>);
};

export default RecipeSearch;
