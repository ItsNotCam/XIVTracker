import React, { useState } from 'react';
import RecipeItem from './RecipeItem';

export interface RecipeTreeProps {
	RecipeData: TCRecipe;
	IsFirst?: boolean;
}

const RecipeTree: React.FC<RecipeTreeProps> = ({ RecipeData, IsFirst }) => {
	const [droppedDown, setDroppedDown] = useState<boolean>(IsFirst || false);
	const hasChildren = RecipeData.ingredients && RecipeData.ingredients.length > 0;

	const toggleDroppedDown = () => {
		setDroppedDown(!droppedDown);
	}

	return (
		<div style={{ 
				marginLeft: IsFirst ? 0 : "1rem",
				borderColor: IsFirst ? "transparent" : "gray"
			}} 
			className="flex flex-col border-l-2 pl-2 transition-[max-height] pt-1 relative"
		>
			<RecipeItem 
				RecipeData={RecipeData} 
				IsFirst={IsFirst} 
				toggleDropdown={toggleDroppedDown} 
				hasChildren={hasChildren}
				droppedDown={droppedDown}
			/>
			{hasChildren ? (
				<div style={{ 
					maxHeight: droppedDown ? '1000px' : '0px',
					overflow: droppedDown ? "visible" : "hidden" 
				}} className="transition-[max-height] flex flex-col">
					{RecipeData.ingredients.map((ingredient) => (
						<RecipeTree RecipeData={ingredient} />
					))}
				</div>
			) : null}
		</div>
	)
};

export default RecipeTree;