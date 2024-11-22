import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toTitleCase } from '@ui/util/util';
import { RecipeTreeProps } from './RecipeTree';

type RecipeItemProps = RecipeTreeProps & {
	toggleDropdown: () => void;
	hasChildren: boolean;
	droppedDown: boolean;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ RecipeData, IsFirst, toggleDropdown, hasChildren, droppedDown }) => {
	const isShard = RecipeData.name.includes("Shard");
	const recipeName = toTitleCase(RecipeData.name);
	const tcLink = `https://ffxivteamcraft.com/db/en/item/${RecipeData.id}`;

	// Get gathering type name - for some reason mining does not have a type ... 
	let gatheringName = "";
	if (RecipeData.gathering) {
		if(RecipeData.gathering.types.length > 1) {
			gatheringName = "(All)";
		} else {
			gatheringName = RecipeData.gathering?.types[0].name || "Mining";
		}
	}
	gatheringName = toTitleCase(gatheringName);

	return (
		<div onClick={toggleDropdown} className='flex flex-row gap-2 border border-custom-gray-200 items-center' style={{ cursor: hasChildren ? "pointer" : "default"  }}>
		<div className='flex flex-row gap-2 items-center cursor-pointer'>
			<img src={RecipeData.icon_path} className="h-[32px]" />
			<h1>
				{IsFirst ? null : <span className='text-custom-text-secondary-300 bloom'>{RecipeData.amount}x </span>}
				<span 
					title={tcLink}
					onClick={(e) => {
						// e.stopPropagation();
						navigator.clipboard.writeText(tcLink);
					}}
				>
					{recipeName}
				</span>
			</h1>
		</div>
		{!isShard ? (
		<div className="text-custom-gray-100/50 ml-auto mr-4">
			{RecipeData.gathering ? (
				<span>Lvl. {RecipeData.gathering?.level} {gatheringName}</span>
			) : null}
			{RecipeData.crafting ? (
				<span>Lvl. {RecipeData.crafting?.level} {toTitleCase(RecipeData.crafting?.job_name || "")}</span>
			) : null}
			{hasChildren ? (
				<ChevronLeftIcon className={`ml-2 transition-transform ${droppedDown ? "-rotate-90" : "rotate-0"}`} />
			) : null}
		</div>
	) : null}
	</div>
	)
}

export default RecipeItem;