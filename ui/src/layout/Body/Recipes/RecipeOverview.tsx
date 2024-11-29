import React from 'react';
import { JobIconList } from '@ui/assets/images/jobs';
import { toTitleCase } from '@ui/util/util';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import JobState from '@electron-lib/JobState';

import { v4 as uuidv4 } from 'uuid';

interface CraftingHeaderProps {
	recipeData: TCRecipe;
	craftingRequirements: any[];
	isFavorite: boolean;
	playerJobs: JobState[];
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
			className='my-auto rounded-full self-start flex-grow-0 w-fit p-2 hover:bg-custom-gray-200/50 transition-colors'
		>
			{ isFavorite ? <FavoriteIcon color="error"/> : <FavoriteBorderIcon style={{ color: "gray" }}/> }
		</button>
	);
}

const CraftingHeader: React.FC<CraftingHeaderProps> = ({ 
	recipeData, 
	craftingRequirements, 
	isFavorite, 
	playerJobs,
	toggleFavorite
}) => {

	const playerJobMap = playerJobs?.reduce((acc, job) => {
		acc[job.job_name] = job;
		return acc;
	}, {} as Record<string, JobState>) || [];

	return (
		<div className="flex flex-row gap-2 pl-2 items-center pb-2 border-b-[4px] border-custom-gray-200/50">
			<FavoriteButton isFavorite={isFavorite} toggleFavorite={toggleFavorite}/>
			<img src={recipeData.icon_path} className="max-w-[3.5rem] " alt="Recipe Icon" />
			<div className="font-forum flex-grow-0  flex-shrink-0">
				<h1 className='text-2xl'>{recipeData.name}</h1>
				<div className="text-xl forum flex flex-row gap-2">
					{recipeData.crafting ? (
						<img src={JobIconList[recipeData.crafting.job_name || ""]} className="h-[1.2em] w-[1.2em] inline" />
					) : null}
					{recipeData.gathering ? recipeData.gathering.types.map((t) => (
						<img src={JobIconList[t.name]} className="h-[1.2em] w-[1.2em] inline" />
					)) : null}
					<p>Lvl. {recipeData.crafting?.level || -1}</p>
				</div>
			</div>
			<div className="flex flex-row gap-[0.25rem] overflow-x-visible overflow-y-visible z-10">
				{craftingRequirements?.map((req) => (
					<div 
						key={uuidv4()} 
						className="relative grid place-items-center group flex-shrink-0 flex-grow-0 group overflow-visible"
						title={toTitleCase(req.job)}
					>
						<img src={req.icon_path} className="grid-centered h-[50px] w-[50px]" />
						<div className="h-[80%] w-[80%] bg-black/20 group-hover:bg-black/0 grid place-items-center grid-centered rounded-lg transition-colors duration-100">
							<h1 className="absolute -bottom-6 text-lg pointer-events-none" style={{
								color: playerJobMap[req.job] && playerJobMap[req.job].level >= req.level ? "lime" : "red"
							}}>{req.level}</h1>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CraftingHeader;