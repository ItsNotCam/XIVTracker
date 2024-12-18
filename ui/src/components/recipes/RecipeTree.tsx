import React, { useState } from 'react';
import RecipeItem from './RecipeItem';
import { v4 as uuidv4 } from 'uuid';

export interface RecipeTreeProps {
	RecipeData: TCRecipe;
	IsFirst?: boolean;
}

const RecipeTree: React.FC<RecipeTreeProps> = ({ RecipeData, IsFirst }) => {
	const [droppedDown, setDroppedDown] = useState<boolean>(false);
	const hasChildren = RecipeData.ingredients && RecipeData.ingredients.length > 0;

	const toggleDroppedDown = () => setDroppedDown(!droppedDown);

	return (
		<div 
			key={uuidv4()}
			style={{ 
				marginLeft: IsFirst ? 0 : "1rem",
				borderColor: IsFirst ? "transparent" : "gray"
			}} 
			className={`
				border-l-2 transition-[max-height] pt-1 
				relative ${IsFirst ? "" : "pl-2"}
			`}
		>
			<RecipeItem 
				RecipeData={RecipeData} 
				IsFirst={IsFirst} 
				toggleDropdown={toggleDroppedDown} 
				hasChildren={hasChildren}
				droppedDown={droppedDown}
			/>
			{hasChildren ? (
				<div 
					style={{ 
						maxHeight: droppedDown ? '1000px'  : '0px',
						overflow:  droppedDown ? "visible" : "hidden" 
					}}
					className="transition-[max-height] flex flex-col"
				>
					{RecipeData.ingredients.filter(i => !i.name.includes("shard")).map((ingredient) => (
						<RecipeTree key={uuidv4()} RecipeData={ingredient} />
					))}
				</div>
			) : null}
		</div>
	)
};

export default RecipeTree;