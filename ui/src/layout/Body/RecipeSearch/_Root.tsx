import './recipe-search.css';

import React, { useEffect, useRef } from 'react';
import SearchBar from './SearchForm';

import { JobIconList } from '@ui/assets/images/jobs';
import { invoke } from '@ui/util/util';
import CraftingItemReqs from './CraftItemReqs';
import RecipeTree from './RecipeTree';
import FavoriteIcon from '@mui/icons-material/Favorite';

const RecipeSearch: React.FC = () => {
	const craftReqsRef = useRef<any[]>([])
	const rawMatReqsRef = useRef<any[]>([])
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const [isSearching, setIsSearching] = React.useState(false);
	const [recipeData, setRecipeData] = React.useState<TCRecipe | null>(null);
	const [craftingRequirements, setCraftingRequirements] = React.useState<any[]>([]);
	const [rawMaterials, setRawMaterials] = React.useState<any[]>([]);
	const [recentSearches, setRecentSearches] = React.useState<any>([]);
	const [favoriteRecipes, setFavoriteRecipes] = React.useState<string[]>([]);

	const sortRecentSearches = async (): Promise<any[]> => {
		const recentSearches = await invoke("ask:recent-recipe-searches").then((r) => 
			r.sort((a: any, b: any) => {
				if(favoriteRecipes.includes(a)) return 1;

				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				new Date(b.date).getTime() - new Date(a.date).getTime()
			})
		);
		return recentSearches;
	}

	useEffect(() => {
		const getFavoriteRecipes = async () => {
			const favoriteRecipes = await invoke("ask:favorite-recipes");

			console.log("Favorite Recipes:", favoriteRecipes);
			setFavoriteRecipes(favoriteRecipes);
		}
		getFavoriteRecipes();

		// const searches = sortRecentSearches();
		// setRecentSearches(searches);

		return () => {
			setFavoriteRecipes([]);
		}
	}, []);

	useEffect(() => {
		const getRecentSearches = async () => {
			const searches = await sortRecentSearches();
			setRecentSearches(searches);
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
			craftReqsRef.current = [{ 
				job: result.crafting?.job_name, 
				level: result.crafting?.level, 
				icon_path: JobIconList[result.crafting?.job_name || ""],
			}]
			rawMatReqsRef.current = [];

			await getAllCraftingRequirements(result);
			setRecipeData(result);
			setCraftingRequirements(craftReqsRef.current);
		}
	}

	const combineRawMaterials = (copyTo: any[], copyFrom: any[]): any[] => {
		for(const mat of copyFrom) {
			const idx = copyTo.findIndex((m) => m.id === mat.id);
			if(idx >= 0) {
				const amount = copyTo[idx].amount + mat.amount;
				copyTo[idx] = { ...mat, amount };
			} else {
				copyTo.push(mat);
			}
		}

		return copyTo;
	}

	const getAllCraftingRequirements = async (recipeData: TCRecipe): Promise<any[]> => {
		let result: any = [];

		console.log("starting with", recipeData.name, ":", recipeData.ingredients);
		await recipeData.ingredients.forEach(async (ingredient: TCRecipe) => {
			const level = recipeData.crafting?.level;
			const crafting = ingredient.crafting;
			const gathering = ingredient.gathering;
			if (crafting && level && level > 1) {
				let changed = false;
				craftReqsRef.current.forEach((curJob) => {
					if (curJob.job === crafting?.job_name) {
						curJob = {
							...curJob,
							level: Math.max(curJob.level, level)
						}
						changed = true;
					}
				})

				if (!changed) {
					craftReqsRef.current.push({
						job: crafting?.job_name,
						level: crafting?.level,
						icon_path: JobIconList[crafting.job_name]
					});
				}
			}
			if (gathering && gathering.level > 1) {
				const level = gathering.level;
				gathering.types?.forEach((t: TCGatheringType) => {
					let jobname = ""
					if (t.name === "Mining" || t.name === "Quarrying") {
						jobname = "miner";
					} else {
						jobname = "botanist";
					}

					let changed = false;
					craftReqsRef.current.forEach((curJob) => {
						if (curJob.job === jobname) {
							curJob = {
								...curJob,
								level: Math.max(curJob.level, level)
							}
							changed = true;
						}
					})

					if (!changed) {
						craftReqsRef.current.push({ job: jobname, level: level || -1, icon_path: JobIconList[jobname] });
					}
				});
			}

			let newResults = [ingredient];
			if (ingredient.ingredients && ingredient.ingredients.length > 0) {
				newResults = await getAllCraftingRequirements(ingredient);
			}
			
			combineRawMaterials(result, newResults);
		});

		setRawMaterials((_) => result);
		return result;
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

	return (<div className={`grid grid-rows-[72px] grid-cols-[75px,1fr] h-[calc(100vh-180px)] `}>
			<div className="flex flex-row justify-between items-center p-4 col-span-2">
				<h1 className="text-content-header">CRAFTING</h1>
				<SearchBar handleSearch={handleSearch} isSearching={isSearching} />
			</div>
			<ul className="overflow-y-auto overflow-x-hidden mx-auto border-custom-gray-200/50">
				{recentSearches.map((search: any) => (
					<li title={search} className="relative transition-transform cursor-pointer flex flex-row gap-2 items-center p-2 h-[64px] w-[64px]" onClick={() => {
						handleSearch(search.recipe.name);
					}}>
						<div style={{ display: favoriteRecipes.includes(search?.recipe.name) ? "block" : "none" }}
							className="absolute left-0 top-0">
							<FavoriteIcon color="error"/>
							{/* <StarIcon style={{ color: "#FFD700" }}/> */}
						</div>
						<img src={search?.recipe.icon_path}/>
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
				/>
				<div className="grid grid-cols-3 gap-1 mx-2 mb-4">
					{rawMaterials.map((r) => (
						<div className="flex flex-row gap-2 items-center h-8 border border-custom-gray-200">
							<img src={r.icon_path} className="h-[32px]"/>
							<p><span className="text-custom-text-secondary-300 bloom">{r.amount}x</span> {r.name}</p>
						</div>
					))}
				</div>
				<div className='overflow-auto h-[calc(100vh-21.5rem)]'>
					<RecipeTree RecipeData={recipeData} IsFirst={true}/>
				</div>
			</div>
			)}
		</div>);
};

export default RecipeSearch;
