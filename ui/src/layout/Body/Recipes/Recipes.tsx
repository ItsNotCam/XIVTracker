import './recipe-search.css';

import React, { useEffect, useRef } from 'react';
import SearchBar from './SearchForm';

import { JobIconList } from '@ui/assets/images/jobs';
import { invoke, onReceive } from '@ui/util/util';
import CraftingHeader from './RecipeOverview';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DropdownButton from '@ui/components/DropdownButton';
import JobState from '@electron-lib/JobState';

import { v4 as uuidv4 } from 'uuid';
import RecipeTree from './components/RecipeTree';

const RecipeSearch: React.FC = () => {
	const craftReqsRef = useRef<any[]>([])
	const rawMatReqsRef = useRef<any[]>([])
	const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

	const [recipeDroppedDown, setRecipeDroppedDown] = React.useState<boolean>(false);
	const [rawMaterialsDroppedDown, setRawMaterialsDroppedDown] = React.useState<boolean>(false);
	const [isSearching, setIsSearching] = React.useState(false);

	const [fullRecipe, setFullRecipe] = React.useState<TCRecipe>();
	const [recipeHeader, setRecipeHeader] = React.useState<any[]>([]);
	const [rawMaterials, setRawMaterials] = React.useState<any[]>([]);

	const [recentRecipeSearches, setRecentRecipeSearches] = React.useState<TCRecipe[]>([]);
	const [favoriteRecipes, setFavoriteRecipes] = React.useState<string[]>([]);
	
	const [playerJobs, setPlayerJobs] = React.useState<JobState[]>([]);

	const getFavoriteRecipes = async () => {
		const favoriteRecipes = await invoke("ask:favorite-recipes");
		setFavoriteRecipes(favoriteRecipes);
	}

	const updateAllJobs = async() => {
		const jobs = await invoke("ask:job-all") || [];
		setPlayerJobs(jobs);
	}

	const handleUpdateAllJobs = (_: any, jobs: JobState[]) => {
		setPlayerJobs(jobs);
	}

	const handleLogin = () => updateAllJobs();

	useEffect(() => {
		getFavoriteRecipes();
		updateAllJobs();

		onReceive("broadcast:login", handleLogin);
		onReceive("update:job-all", handleUpdateAllJobs);
		onReceive("broadcast:tcp-connected", updateAllJobs);

		return () => {
			setFavoriteRecipes([]);
			window.ipcRenderer.removeListener("update:login", handleLogin);
			window.ipcRenderer.removeListener("update:job-all", handleUpdateAllJobs);
			window.ipcRenderer.removeListener("broadcast:tcp-connected", updateAllJobs);
		}
	}, []);

	useEffect(() => {
		const getRecentSearches = async () => {
			setRecentRecipeSearches(
				await sortRecentSearches()
			);
		}
		getRecentSearches();
	}, [recipeHeader])

	const sortRecentSearches = async (): Promise<any[]> => {
		const recentSearches = await invoke("ask:recent-recipe-searches").then((r) => 
			r.sort((a: any, b: any) => {
				// if(favoriteRecipes.includes(a)) return 1;

				if (a.name < b.name) return -1;
				if (a.name > b.name) return 1;
				new Date(b.date).getTime() - new Date(a.date).getTime()
			})
		);
		return recentSearches;
	}

	const handleSearch = (recipeName: string) => {
		if(isSearching) {
			return;
		}

		const isSearchingTimeout = setTimeout(() => {
			setIsSearching(false);
		}, 200);

		if(searchTimeoutRef.current) {
			clearTimeout(searchTimeoutRef.current)
		};
		searchTimeoutRef.current = setTimeout(() => { setIsSearching(false); }, 2000);

		const getRecipe = async () => {
			setIsSearching(true);

			try {
				const result = await window.ipcRenderer.invoke('ask:recipe', recipeName);
				onSearchComplete(result);
			} catch(e: any) {
				console.error(e);
			} finally {
				if(searchTimeoutRef.current) {
					clearTimeout(searchTimeoutRef.current);
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
		if (result !== null && result.name === fullRecipe?.name) {
			return;
		}

		if (result) {
			craftReqsRef.current = [{ 
				job: result.crafting?.job_name, 
				level: result.crafting?.level, 
				icon_path: JobIconList[result.crafting?.job_name || ""],
			}]
			rawMatReqsRef.current = [];

			await getAllCraftingRequirements(result);
			setFullRecipe(result);
			setRecipeHeader(craftReqsRef.current);
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
		if (fullRecipe === undefined) {
			return;
		}

		const isFavorite = await invoke("set:toggle-favorite-recipe", fullRecipe.name);
		if (isFavorite) {
			setFavoriteRecipes([...favoriteRecipes, fullRecipe.name]);
		} else {
			setFavoriteRecipes(favoriteRecipes.filter((r) => r !== fullRecipe.name));
		}
	}

	const calculateGridTemplateRows = (): string => {
		return "auto 1fr";
	}

	const calcMaxHeightRawMaterials = (): string => {
		return "50vh";
	}

	const calcMaxHeightRecipes = (): string => {
		return "50vh";
	}

	return (<div className={`grid grid-rows-[72px] grid-cols-[75px,1fr] h-[calc(100vh-180px)] `}>
			<div className="flex flex-row justify-between items-center p-4 col-span-2">
				<h1 className="text-content-header">CRAFTING</h1>
				<SearchBar handleSearch={handleSearch} isSearching={isSearching} />
			</div>
			<div className='mx-auto overflow-y-auto overflow-x-hidden border-custom-gray-200/50'>
				<ul>
					{recentRecipeSearches.map((search: any) => (
						<li 
							key={uuidv4()} 
							title={search}
							className="relative transition-transform cursor-pointer flex flex-row gap-2 items-center p-2 h-[64px] w-[64px]" 
							onClick={() => { handleSearch(search.recipe.name) }}
						>
							<div className="absolute left-0 top-0" style={{ 
								display: favoriteRecipes.includes(search?.recipe?.name) ? "block" : "none"  
							}}>
								<FavoriteIcon color="error"/>
							</div>
							<img src={search?.recipe?.icon_path}/>
						</li>
					))}
				</ul>
			</div>
			{fullRecipe === undefined ? (
				<h1 className="3xl text-center mt-8 h-fit">Search for a recipe to get started</h1>
			) : (
			<div className="border-l-4 border-custom-gray-200/50 flex flex-col">
				<CraftingHeader 
					craftingRequirements={recipeHeader} 
					recipeData={fullRecipe} 
					isFavorite={favoriteRecipes.includes(fullRecipe.name)}
					toggleFavorite={toggleFavoriteRecipe}
					playerJobs={playerJobs}
				/>
				<div className='m-2 ' style={{
					gridTemplateRows: calculateGridTemplateRows(),
				}}>
					<div id="raw materials" className="mb-2">
						<div className='flex flex-row items-center gap-2'>
							<DropdownButton droppedDown={rawMaterialsDroppedDown} setDroppedDown={setRawMaterialsDroppedDown} />
							<h1 className="text-custom-text-secondary-300 text-xl bloom">Raw Materials</h1>
						</div>
						<div className="overflow-auto transition-[max-height]" style={{
								maxHeight: rawMaterialsDroppedDown ? '2500px' : '0px',
						}}>
							<div className="transition-[max-height]" style={{ 
								maxHeight: calcMaxHeightRawMaterials()
							}}>
								{rawMaterials.map((r) => <RecipeTree key={uuidv4()} RecipeData={r} IsFirst={true}/>)}
							</div>
						</div>
					</div>
					<div id="recipe" >
						<div className="flex flex-row gap-2 items-center">
							<DropdownButton droppedDown={recipeDroppedDown} setDroppedDown={setRecipeDroppedDown} />
							<h1 className="text-custom-text-secondary-300 text-xl bloom">Recipe</h1>
						</div>
						<div className='overflow-auto transition-[max-height]' style={{ 
								maxHeight: recipeDroppedDown ? '2500px' : '0px',
						}}>
							<div className="flex flex-col transition-[max-height] flex-grow" style={{ 
								maxHeight: calcMaxHeightRecipes() 
							}}>
								{fullRecipe.ingredients 
									? fullRecipe.ingredients.map((ingredient) => (
										<RecipeTree key={uuidv4()} RecipeData={ingredient} IsFirst={true}/>
									)) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
			)}
		</div>);
};

export default RecipeSearch;
