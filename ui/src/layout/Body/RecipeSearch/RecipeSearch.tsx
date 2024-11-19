import './recipe-search.css';

import { TCGatheringType, TCRecipe } from '@electron/libs/providers/RecipeProviderTypes';
import React, { useRef } from 'react';
import SearchBar from './SearchBar';

import { JobIconList } from '@ui/assets/images/jobs';
import { toTitleCase } from '@ui/util/util';

const RecipeSearch: React.FC = () => {
	const reqs = useRef<any[]>([])

	const [recipeData, setRecipeData] = React.useState<TCRecipe | null>(null);
	const [craftingRequirements, setCraftingRequirements] = React.useState<any[]>([]);

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
				reqs.current.forEach((curJob, i) => {
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
					reqs.current.forEach((curJob, i) => {
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
				<SearchBar onSearchComplete={onSearchComplete} />
			</div>
			{recipeData === null && (
				<h1 className="3xl text-center mt-8">Search for a recipe to get started</h1>
			)}
			{recipeData && (
			<div className="overflow-y-auto px-4">
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
							<div key={`crafting-req-${req.job}`} className="grid place-items-center group">
								<h1 className='grid-centered z-[1] group-hover:opacity-100 opacity-0 transition-opacity duration-100 translate-y-10'>
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
		</>);
};

export default RecipeSearch;