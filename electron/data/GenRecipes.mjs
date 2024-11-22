import * as fs from 'fs/promises';

const recipeReqs = {
	id: 0,
	amount: 0,
	name: "",
	icon_path: "",
	gathering: [{
		items: [{}],
		level: 0,
		type: 0,
		map_name: "",
		job_name: ""
	}],
	drop_sources: [{
		id: 0,
		name: "",
		drops: [{
			id: 0,
			name: "",
			icon_path: "",
			positions: [{
				x: 0,
				y: 0,
				map_name: "",
				zone_name: ""
			}]
		}],
	}],
	crafting: {
		job: "",
		job_name: "",
		level: 0
	},
	ingredients: []
}


const isNumber = (n) => !isNaN(parseFloat(n)) && isFinite(n);
const str = (s) => s.toString();

const ok = async () => {

const [
	dropSources,
	gatheringItems,
	gatheringLevels,
	gatheringSearchIndex,
	gatheringTypes,
	itemIcons,
	itemLevel,
	items,
	jobName,
	mapEntries,
	mobs,
	monsters,
	nodes,
	places,
	recipes,

	xivGatheringItemsById,
	xivItemIdByName,
	xivMapEntriesById,
	xivMonstersById,
	xivNodesByItemId,
	xivRecipeById,
] = await Promise.all([
	fs.readFile("./teamcraft/drop-sources.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/gathering-items.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/gathering-levels.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/gathering-search-index.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/gathering-types.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/item-icons.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/item-level.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/items.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/job-name.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/map-entries.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/mobs.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/monsters.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/nodes.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/places.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/recipes.json").then(r => JSON.parse(r.toString())),

	fs.readFile("./teamcraft/xiv_gathering-items-by-id.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/xiv_item-id-by-name.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/xiv_map-entries-by-id.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/xiv_monsters-by-id.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/xiv_nodes-by-item-id.json").then(r => JSON.parse(r.toString())),
	fs.readFile("./teamcraft/xiv_recipe-by-id.json").then(r => JSON.parse(r.toString())),
]);

console.log("Drop sources loaded:", dropSources !== undefined);
console.log("Gathering items loaded:", gatheringItems !== undefined);
console.log("Gathering levels loaded:", gatheringLevels !== undefined);
console.log("Gathering search index loaded:", gatheringSearchIndex !== undefined);
console.log("Gathering types loaded:", gatheringTypes !== undefined);
console.log("Item icons loaded:", itemIcons !== undefined);
console.log("Item level loaded:", itemLevel !== undefined);
console.log("Items loaded:", items !== undefined);
console.log("Job name loaded:", jobName !== undefined);
console.log("Map entries loaded:", mapEntries !== undefined);
console.log("Mobs loaded:", mobs !== undefined);
console.log("Monsters loaded:", monsters !== undefined);
console.log("Nodes loaded:", nodes !== undefined);
console.log("Places loaded:", places !== undefined);
console.log("Recipes loaded:", recipes !== undefined);
console.log("xivGatheringItemsById loaded:", xivGatheringItemsById !== undefined);
console.log("xivItemIdByName loaded:", xivItemIdByName !== undefined);
console.log("xivMapEntriesById loaded:", xivMapEntriesById !== undefined);
console.log("xivMonstersById loaded:", xivMonstersById !== undefined);
console.log("xivNodesByItemId loaded:", xivNodesByItemId !== undefined);
console.log("xivRecipeById loaded:", xivRecipeById !== undefined);

const getGatheringData = (itemId) => {
	function getGatheringLevelById(itemId) {
		const levels = xivGatheringItemsById;
		if(levels[itemId.toString()] !== undefined) {
			return parseInt(levels[itemId].level);
		}

		return null;
	}

	function getGatheringItemsById(itemId) {
		return xivGatheringItemsById[str(itemId)]?.level;
	}

	const gatheringLevel = getGatheringLevelById(itemId);
	if(gatheringLevel === null) {
		// console.log("No gathering level found for", itemId);
		return null
	}

	const gts = getGatheringTypesById(itemId);

	return gts.map(type => ({
		items: getGatheringItemsById(itemId),
		level: getGatheringLevelById(itemId),
		map_name: xivMapEntriesById[type.id]?.name,
		job_name: gatheringTypes[type.id]?.en
	}));

	function getGatheringNameById(itemId) {
		if (gatheringTypes[itemId.toString()] === undefined) {
			return null;
		}

		return gatheringTypes[itemId.toString()].en;
	}

	function getGatheringTypesById(itemId) {
		// if(!gatheringSearchIndex[itemId] || !gatheringSearchIndex[itemId].types)
		// 	return null;

		const levels = gatheringSearchIndex;
		const gt = gatheringTypes;

		if(levels[itemId.toString()] !== undefined) {
			return levels[itemId].types.map((type) => ({
				id: type,
				name: gt[type.toString()]?.en
			}));
		}
	}
}

const getDropSources = (itemId) => {
	function getItemNameFromId(itemId) {
		if(items[itemId] !== undefined)  {
			return items[itemId].en;
		}

		return null;
	}
	
	function getIconPathOfItemId(itemId) {
		const icon = itemIcons[itemId];
		if(icon !== undefined) {
			return `https://xivapi.com${icon}`;
		}

		return null;
	}

	function getAllDropsOfMob(mobId) {
		let sources = [];
		Object.keys(dropSources).forEach((itemId) => {
			const source = dropSources[itemId];
			if(source.includes(mobId)) {
				const id = parseInt(itemId);
				sources.push({
					id: id,
					name: getItemNameFromId(id),
					icon_path: getIconPathOfItemId(id)
				});
			}
		});

		return sources;
	}
	
	function getMobLocationsById(mobId) {
		const mapEntries = xivMapEntriesById;
		const zoneEntries = places;
		
		let data = null;
		if(monsters[mobId.toString()] !== undefined) {
			const monster = monsters[str(mobId)];
			data = monster.positions.map((pos) => {
				const mapId = pos.map;
				const zoneId = pos.zoneid;

				const mapName = mapEntries[mapId].name;
				const zoneName = zoneEntries[zoneId].en;

				return {
					...pos,
					map_name: mapName,
					zone_name: zoneName
				}
			});
		}

		return data;
	}

	if(!dropSources[str(itemId)] || dropSources[str(itemId)].length === 0) { 
		return null;
	}

	const sources = dropSources[str(itemId)].map((source) => {
		const mobId = source;
		const mobName = mobs[source].en;

		const allDrops = getAllDropsOfMob(mobId);
		let positions = getMobLocationsById(mobId);
		
		return {
			id: mobId,
			name: mobName,
			drops: allDrops,
			positions: positions
		}
	});

	return sources;
}

const getAllLevelRequirements = (results, levelRequirements = {}) => {
	for(let i = 0; i < results.length; i++) {
		console.log(i)
		const result = results[i];
		const curRequirements = levelRequirements[result.crafting.job];
		if(curRequirements === undefined) {
			levelRequirements[result.crafting.job] = result.crafting.level;
		} else {
			levelRequirements[result.crafting.job] = Math.max(curRequirements, result.crafting.level);
		}

		if(results.ingredients === undefined) {
			continue;
		}

		for(let j = 0; j < results.ingredients.length; j++) {
			const ingredient = results.ingredients[j];
			const reqs = getAllLevelRequirements(ingredient);
			levelRequirements = { ...levelRequirements, ...reqs }
		}
	}

	return levelRequirements;
}

const getIngredients = (ingredient) => {
	const {amount, id} = ingredient;

	const result = {
		id: id,
		amount: amount,
		name: items[id]?.en,
		icon_path: `https://xivapi.com${itemIcons[id]}`,
		gathering: getGatheringData(id),
		drop_sources: getDropSources(id),
		crafting: {
			job: null,
			job_name: null,
			level: -1
		},
		ingredients: []
	}

	const recipe = xivRecipeById[str(id)];
	if(recipe === undefined) {
		return result
	}

	return ({
		...result,
		crafting: {
			job: recipe.job,
			job_name: jobName[recipe.job]?.en,
			level: recipe.lvl
		},
		ingredients: recipe.ingredients.map(subIngredient => getIngredients(subIngredient))
	})
}

let baseResults = await Promise.all(recipes.map((recipe, i) => {
	const recipeId = recipe.result.toString();

	// id: recipe.id,
	let result = {
		amount: recipe.yields,
		name: items[recipeId]?.en,
		icon_path: `https://xivapi.com${itemIcons[recipeId]}`,
		gathering: getGatheringData(recipeId),
		drop_sources: getDropSources(recipeId),
		crafting: {
			job: recipe.job,
			job_name: jobName[recipe.job]?.en,
			level: recipe.lvl
		},
		ingredients: recipe.ingredients.map(ingredient => getIngredients(ingredient))
	}

	const reqs = getAllLevelRequirements(result);
	// console.log(reqs);
	
	result.levelRequirements = reqs;

	return result;
}));

console.log("Recipes generated:", baseResults.length, baseResults[10]);

const chunkSize = 100;
const chunks = [];

for (let i = 0; i < baseResults.length; i += chunkSize) {
	chunks.push(baseResults.slice(i, i + chunkSize));
}

await fs.writeFile("./gen.json", JSON.stringify(chunks[0]));

// for (let i = 0; i < chunks.length; i++) {
// 	await fs.writeFile(`./generated-recipes/generated-recipes-${i + 1}.json`, JSON.stringify(chunks[i]));
// }
}

ok();
