import React, { useEffect, useState } from 'react';
import { toTitleCase } from '@ui/util/util';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { JobModel } from '@backend/types';

interface CraftingHeaderProps {
	recipeData: TCRecipe;
	craftingRequirements: any[];
	isFavorite: boolean;
	playerJobs: JobModel[];
	toggleFavorite: () => void;
}

interface FavoriteButtonProps {
	isFavorite: boolean;
	toggleFavorite: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, toggleFavorite }) => {
	return (
		<button 
			onClick={toggleFavorite}
			role="checkbox"
			className='my-auto rounded-full self-start grow-0 w-fit p-2 hover:bg-custom-gray-200/50 transition-colors'
		>
			{ isFavorite ? <FavoriteIcon color="error"/> : <FavoriteBorderIcon style={{ color: "gray" }}/> }
		</button>
	);
}

const CraftingHeader: React.FC<CraftingHeaderProps> = ({ 
	craftingRequirements, 
	isFavorite, 
	playerJobs,
	toggleFavorite
}) => {
	const [craftingReqs, setCraftingReqs] = useState<any[]>(craftingRequirements);

	const playerJobMap = playerJobs?.reduce((acc, job) => {
		acc[job.name.toLowerCase()] = job;
		return acc;
	}, {} as Record<string, JobModel>) || [];

	const calculateCraftingRequirements = () => {
		setCraftingReqs(craftingRequirements.map(r => ({
			...r, canCraft: canCraftItem(r)
		})))
	}

	useEffect(() => {
		calculateCraftingRequirements()
	},[]);
	
	useEffect(() => {
		calculateCraftingRequirements()
	},[craftingRequirements]);

	const canCraftItem = (req: any) => {
		if(!req.job || !req.level || !playerJobMap[req.job]) 
			return false;

		const job = playerJobMap[req.job];

		const reqLevel = req.level;
		const jobLevel = job.level;

		if(reqLevel % 10 === 0) {
			return (reqLevel - jobLevel) <= 5;
		}

		const nearestLowerMultipleOfFive = reqLevel - (reqLevel % 5);
		return (jobLevel >= reqLevel) || (jobLevel >= nearestLowerMultipleOfFive);
	}

	return (
		<div className="flex flex-row pl-2 items-center pb-2 border-b-4 border-custom-gray-200/50">
			<FavoriteButton isFavorite={isFavorite} toggleFavorite={toggleFavorite}/>
			{/* <img src={recipeData.icon_path} className="max-w-[3.5rem] " alt="Recipe Icon" /> */}
			{/* <div className="font-forum flex-grow-0  flex-shrink-0">
				<h1 className='text-2xl'>{recipeNameTruncated}</h1>
				<div className="text-xl forum flex flex-row gap-2">
					{recipeData.crafting ? (
						<img src={JobIconList[recipeData.crafting.job_name || ""]} className="h-[1.2em] w-[1.2em] inline" />
					) : null}
					{recipeData.gathering ? recipeData.gathering.types.map((t) => (
						<img src={JobIconList[t.name]} className="h-[1.2em] w-[1.2em] inline" />
					)) : null}
					<p>Lvl. {recipeData.crafting?.level || -1}</p>
				</div>
			</div> */}
			<div className="ml-2 flex flex-row grow gap-1 overflow-y-visible overflow-x-auto z-10">
				{craftingReqs?.map((req) => (
					<div 
						key={crypto.randomUUID()} 
						title={toTitleCase(req.job)}
						className="
							relative grid place-items-center 
							group shrink-0 grow-0 group overflow-visible
					">
						<img src={req.icon_path} className="grid-centered h-12.5 w-12.5" />
						<div className="
							h-[80%] w-[80%] bg-black/50 group-hover:bg-black/0 
							grid place-items-center grid-centered rounded-lg 
							transition-colors duration-100
						">
							<h1 className="text-lg pointer-events-none font-bold" style={{
								color: req.canCraft ? "lime" : "red"
							}}>{req.level}</h1>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CraftingHeader;