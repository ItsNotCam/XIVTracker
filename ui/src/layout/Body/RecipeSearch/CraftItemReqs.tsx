import React from 'react';
import { JobIconList } from '@ui/assets/images/jobs';
import { toTitleCase } from '@ui/util/util';

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

export interface CraftingItemReqsProps {
	recipeData: TCRecipe;
	craftingRequirements: any[];
	isFavorite: boolean;
	toggleFavorite: () => void;
	toggleGoal: () => void;
}

const CraftingItemReqs: React.FC<CraftingItemReqsProps> = ({ 
	recipeData, 
	craftingRequirements, 
	isFavorite, 
	toggleFavorite,
	toggleGoal
}) => {
	return (
		<div className="flex flex-row gap-2 pl-2 items-center pb-2 border-b-[4px] border-custom-gray-200/50">
			<div className="flex flex-col">
				<button onClick={toggleFavorite} role="checkbox" className='rounded-full self-start flex-grow-0 w-fit p-2 hover:bg-custom-gray-200/50 transition-colors'>
					{ isFavorite 
						? <FavoriteIcon color="error"/>
						: <FavoriteBorderIcon style={{color: "gray"}}/>}
				</button>
				{/* <button onClick={toggleGoal} role="checkbox" className='rounded-full flex-grow-0 w-fit p-2 hover:bg-custom-gray-200/50 transition-colors'>
					{ isFavorite 
						? <EmojiEventsIcon style={{color: "#dec652"}}/>
						: <EmojiEventsIcon style={{color: "gray"}}/>}
				</button> */}
			</div>
			<img src={recipeData.icon_path} className="max-w-[3.5rem] " alt="Recipe Icon" />
			<div className="font-forum flex-grow-0  flex-shrink-0">
				<h1 className='text-2xl'>{recipeData.name}</h1>
				<div className="text-xl forum flex flex-row gap-2">
					{recipeData.crafting ? (
						<img src={JobIconList[recipeData.crafting?.job_name || ""]} className="h-[1.2em] w-[1.2em] inline" />
					) : null}
					{recipeData.gathering && recipeData.gathering.types.map((t, i) => (
						<img src={JobIconList[t.name]} className="h-[1.2em] w-[1.2em] inline" />
					))}
					<p>Lvl. {recipeData.crafting?.level}</p>
				</div>
			</div>
			<div className="crafting-requirement-container flex flex-row gap-[0.25rem] overflow-auto z-10">
			{craftingRequirements?.map((req) => (
					<div key={`crafting-req-${req.job}`} className="grid place-items-center group flex-shrink-0 flex-grow-0 group" title={toTitleCase(req.job)}>
						{/* <h1 className='absolute overflow-visible grid-centered z-[1] opacity-0 transition-opacity duration-100 translate-y-14 hidden group-hover:block group-hover:opacity-100 '>
									Lvl. {req.level}<br/>
									{toTitleCase(req.job)}
								</h1> */}
						<img src={req.icon_path} className="grid-centered h-[50px] w-[50px]" />
						<div className="h-[80%] w-[80%] bg-black/40 group-hover:bg-black/0 grid place-items-center grid-centered rounded-lg transition-colors duration-100">
							<h1 className="text-xl pointer-events-none group-hover:opacity-0 opacity-100 transition-opacity" style={{
								color: Math.random() > 0.5 ? 'lime' : 'red'
							}}>{req.level}</h1>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default CraftingItemReqs;