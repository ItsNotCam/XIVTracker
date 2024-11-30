import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { toTitleCase } from '@ui/util/util';
import GatheringSources from '../../layout/Body/Recipes/GatheringSources';
import DropSources from '../../layout/Body/Recipes/DropSources';
import { RecipeTreeProps } from './RecipeTree';

type RecipeItemProps = RecipeTreeProps & {
	toggleDropdown: () => void;
	hasChildren: boolean;
	droppedDown: boolean;
}

const RecipeItem: React.FC<RecipeItemProps> = ({ RecipeData, toggleDropdown, hasChildren, droppedDown }) => {
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
	<div 
		className='flex flex-col border border-custom-gray-200'
		style={{ cursor: hasChildren ? "pointer" : "default"  }}
	>
		<div className="flex flex-row gap-2 items-center hover:bg-custom-gray-200" onClick={toggleDropdown}>
			<div className='flex flex-row gap-2 items-center cursor-pointer'>
				<img src={RecipeData.icon_path} className="h-[32px]"/>
				<h1>
					<span className='text-custom-text-secondary-300 bloom'>
						{`${RecipeData.amount}x `}
					</span>
					<span title={tcLink} onClick={() => { navigator.clipboard.writeText(tcLink) }}>
						{recipeName}
					</span>
				</h1>
			</div>
			{isShard ? null : (
				<div className="text-custom-gray-100/50 ml-auto mr-4">
					{RecipeData.gathering ? (
						<span>Lvl. {RecipeData.gathering?.level} {gatheringName}</span>
					) : null}
					{RecipeData.crafting ? (
						<span>Lvl. {RecipeData.crafting?.level} {toTitleCase(RecipeData.crafting?.job_name || "")}</span>
					) : null}
					{hasChildren ? (
						<ChevronLeftIcon className={`ml-2 transition-transform ${droppedDown ? "-rotate-90" : "rotate-0"}`}/>
					) : null}
				</div>
			)}
		</div>
		<div className="ml-2 text-custom-gray-100/50">
			{RecipeData.gathering ? (
				<div style={{ 
					maxHeight: droppedDown ? '1000px' : '0px',
					overflow: droppedDown ? "visible" : "hidden" 
				}} className="transition-[max-height] flex flex-col">
					<GatheringSources data={RecipeData.gathering} />
				</div>
			) : null}
			{RecipeData.drop_sources ? (
				<div style={{ 
					maxHeight: droppedDown ? '1000px' : '0px',
					overflow: droppedDown ? "visible" : "hidden" 
				}} className="transition-[max-height] flex flex-col">
					<DropSources data={RecipeData.drop_sources} />
				</div>
			) : null}
		</div>
	</div>
	)
}

export default RecipeItem;