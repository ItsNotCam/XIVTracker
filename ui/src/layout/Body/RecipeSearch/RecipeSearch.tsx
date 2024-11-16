import { TCGatheringType, TCRecipe } from '@electron-lib/lumina/TeamCraftTypes';
import React, { useRef } from 'react';
import SearchBar from './SearchBar';

import JobIcons from '@ui/util/jobIcons';

const RecipeSearch: React.FC = () => {
	const reqs = useRef<any[]>([])

	const [recipeData, setRecipeData] = React.useState<TCRecipe | null>(null);
	const [craftingRequirements, setCraftingRequirements] = React.useState<any[]>([]);

	const onSearchComplete = async (result: TCRecipe | null) => {
		setRecipeData(result);
		if(result) {
			reqs.current = [
				{ job: result.crafting?.job_name, level: result.crafting?.level, icon_path: JobIcons[result.crafting?.job_name || ""] }
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
			if(crafting && level && level > 1) {
				let changed = false;
				reqs.current.forEach((curJob,i) => {
					if(curJob.job === crafting?.job_name) {
						curJob = {
							...curJob,
							level: Math.max(curJob.level, level)
						}
						changed = true;
					}
				})

				if(!changed) {
					reqs.current.push({ 
						job: crafting?.job_name, 
						level: crafting?.level, 
						icon_path: JobIcons[crafting.job_name] 
					});
				}
			}
			if(gathering && gathering.level > 1) {
				const level = gathering.level;
				gathering.types?.forEach((t: TCGatheringType) => {
					console.log(`UNDEFINED asfoiugsaviydfkjlk '${t.name}'`, JobIcons[t.name])
					let jobname = ""
					if(t.name === "Mining" || t.name === "Quarrying") {
						jobname = "miner";
					} else {
						jobname = "botanist";
					}

					let changed = false;
					reqs.current.forEach((curJob,i) => {
						if(curJob.job === jobname) {
							curJob = {
								...curJob,
								level: Math.max(curJob.level, level)
							}
							changed = true;
						}
					})

					if(!changed) {
						reqs.current.push({ job: jobname, level: level || -1, icon_path: JobIcons[jobname] });
					}
				});
			}
			if(ingredient.ingredients && ingredient.ingredients.length > 0) {
				getAllCraftingRequirements(ingredient);
			}
		});
	}

	return (
	<>
		<div className="flex flex-row justify-between items-center p-4">
			<h1 className="text-content-header">CRAFTING</h1>
			<SearchBar onSearchComplete={onSearchComplete}/>
		</div>
		<div className="overflow-y-auto px-4">
			<div className="flex flex-row gap-4 items-center">
				<img src={recipeData?.icon_path} className="w-auto h-auto" alt="Recipe Icon" />
				<div className="font-forum flex-shrink-0">
					<h1 className='text-4xl'>{recipeData?.name}</h1>
					<div className="text-3xl forum flex flex-row gap-2">
						<img src={JobIcons[recipeData?.crafting?.job_name || ""]} className="h-[1.2em] w-[1.2em] inline"/>
						<p>Lvl. {recipeData?.crafting?.level}</p>
					</div>
				</div>
				<div className="flex flex-wrap flex-row gap-2">
					{craftingRequirements?.map((req) => (
						<div key={`crafting-req-${req.name}`} className="grid place-items-center h-[64px] w-[64px]">
							<img src={req.icon_path} className="grid-centered" />
							<div className="h-full w-full bg-black/50 grid place-items-center grid-centered rounded-2xl">
								<h1 className="text-3xl">{req.level}</h1> 
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="">
			</div>
		</div>
	</>);
};

export default RecipeSearch;