import path from "path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";

export default class RecipeProvider {
	files = null;
	basePath = "";
	
	dataTypes = [
		"items", "xiv_item-id-by-name", "xiv_recipe-by-id", "item-level", "item-icons", "job-name",
		"xiv_gathering-items-by-id", "gathering-search-index", "gathering-types", "xiv_map-entries-by-id",
		"drop-sources", "mobs", "xiv_monsters-by-id", "places", "xiv_nodes-by-item-id"
	]

	constructor(basePath) {	
		this.basePath = basePath;
	}

	isSetup = () => this.files !== null;

	close() {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		this.files.clear();
		this.files = null;
	}

	
	generateRecipes = async(basePath) => {
		console.log("[Update TC Data] Generating recipes...");
		const recipesData = JSON.parse(await fs.readFile(
			path.resolve(basePath, `recipes.json`), 'utf8')
		);

		let outData = {};
		recipesData.forEach(entry => {
			const result = entry["result"];
			console.log("getting recipe for", result);

			const recipe = this.getRecipeByItemIdentifier(result);
			outData[result] = recipe;
		});
		console.log("[Update TC Data] Recipes generated.");
		return outData;
	}


	init() {
		this.files = {};

		this.dataTypes.forEach(dt => {
			try { 
				const data = this.loadDataSync((dt));
				this.files[dt] = data;
			} catch(e) { 
				console.error("Failed to get data for:", dt, e);
			};
		})

		return this;
	}

	loadDataSync(dataType) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files[dataType] !== undefined) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		// const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		const filepath = path.resolve(`./teamcraft/${dataType}.json`);
		if(!fsSync.existsSync(filepath)) {
			throw(new Error("File does not exist: " + filepath));
		}

		const data = fsSync.readFileSync(filepath);
		return JSON.parse(data.toString());
	}
	
	async loadData(dataType) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files === null) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files[dataType] !== undefined) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		// const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		const filepath = path.resolve(`./teamcraft/${dataType}.json`);
		const fileExists = await fs.stat(filepath).catch(() => false);
		if(!fileExists) {
			throw new Error("File does not exist: " + filepath);
		}

		const data = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	};

	getItemNameFromId(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files["items"];
		if(items[itemId] !== undefined)  {
			return items[itemId].en;
		}

		return null;
	}

	getIdFromItemName(itemName) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		const items = this.files["xiv_item-id-by-name"];
		if(items === undefined) {
			throw(new Error("Items not loaded, " + this.files.size));
		}

		if(items[itemName] !== undefined) {
			return items[itemName];
		}

		return null;
	}

	getRootRecipe(recipeId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files["xiv_recipe-by-id"];
		if(items[recipeId] !== undefined) {
			return items[recipeId];
		}

		return null;
	}

	getRecipeByItemIdentifier(itemIdentifier) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		// console.log("\tGetting recipe for", itemIdentifier);

		let finalRecipe = null;
		finalRecipe = this.getRecipeRecursive(itemIdentifier);
		return finalRecipe;
	}

	isCraftable(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const recipe = this.getRootRecipe(itemId);
		return recipe !== null;
	}

	getIconPathOfItemId(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		
		const items = this.files["item-icons"];
		if(items[itemId] !== undefined) {
			return `https://xivapi.com${items[itemId]}`;
		}

		return null;
	}

	getJobNameById(jobId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const jobs = this.files["job-name"];
		if(jobs[jobId] !== undefined) {
			return jobs[jobId]["en"];
		}

		return null;
	}

	getGatheringLevelById(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const levels = this.files["xiv_gathering-items-by-id"];
		if(levels[itemId.toString()] !== undefined) {
			return parseInt(levels[itemId].level);
		}

		return null;
	}

	getGatheringNameById(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const gt = this.files["gathering-types"];
		if(gt[itemId.toString()] !== undefined) {
			return gt[itemId.toString()].en;
		}
		return null;
	}

	getGatheringTypesById(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const levels = this.files["gathering-search-index"];
		const gt = this.files["gathering-types"];
		if(levels[itemId.toString()] !== undefined) {
			return levels[itemId].types.map((type) => ({
				id: type,
				name: gt[type.toString()]?.en
			}));
		}

		return null
	}

	getAllDropsOfMob(mobId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files["drop-sources"];

		let sources = [];
		Object.keys(dropSources).forEach((itemId) => {
			const source = dropSources[itemId];
			if(source.includes(mobId)) {
				const id = parseInt(itemId);
				sources.push({
					id: id,
					name: this.getItemNameFromId(id),
					icon_path: this.getIconPathOfItemId(id)
				});
			}
		});

		return sources;
	}

	getMobLocationsById(mobId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const monsters = this.files["xiv_monsters-by-id"];

		const mapEntries = this.files["xiv_map-entries-by-id"];
		const zoneEntries = this.files["places"];
		
		let data = null;
		if(monsters[mobId.toString()] !== undefined) {
			const monster = monsters[mobId];
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

	getDropSourceById(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files["drop-sources"];
		if(dropSources === undefined || !dropSources[itemId.toString()] !== undefined || dropSources[itemId].length === 0) {
			return null;
		}

		const mobs = this.files["mobs"];
		const outData = dropSources[itemId].map((source) => {
			const mobId = source;
			const mobName = mobs[source].en;

			const allDrops = this.getAllDropsOfMob(mobId);
			let positions = this.getMobLocationsById(mobId);
			
			return {
				id: mobId,
				name: mobName,
				drops: allDrops,
				positions: positions
			}
		});

		return outData;
	}

	getGatheringLocationsById(itemId) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const nodes = this.files["xiv_nodes-by-item-id"];
		if(nodes === undefined) {
			console.log("Nodes not generated");
			return null;
		}

		if(nodes[itemId.toString()] === undefined) {
			console.log("No nodes found for item id: " + itemId);
			return null;
		}

		let outData = []
		const nodeData = nodes[itemId.toString()];
		for(const node of nodeData) {
			const mapId = node.map;
			const zoneId = node.zoneid;

			let mapName = "";
			let zoneName = "";

			const mapEntries = this.files["xiv_map-entries-by-id"];
			if(mapId !== undefined && mapEntries !== undefined && mapEntries[mapId.toString()] !== undefined) {
				mapName = mapEntries[mapId.toString()].name;
			}

			const zoneEntries = this.files["places"];
			if(zoneId !== undefined && zoneEntries !== undefined && zoneEntries[zoneId.toString()] !== undefined) {
				zoneName = zoneEntries[zoneId.toString()].en;
			}

			const job_name = this.getGatheringNameById(node.type);

			outData.push({
				...node,
				map_name: mapName,
				zone_name: zoneName,
				job_name: job_name
			});
		}

		return outData;
	}

	getRecipeRecursive(itemIdentifier, additionalData = {
		levelRequirements: []
	}) {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		let itemId = 0;
		if(typeof itemIdentifier === "string") {
			const result = this.getIdFromItemName(itemIdentifier);
			if(result === null) {
				return null;
			}
			itemId = result;
		} else {
			itemId = itemIdentifier;
		}
	
		const recipeData = this.getRootRecipe(itemId);
		if(!recipeData) {
			return null;
		}
	
		const itemName = this.getItemNameFromId(itemId);
		const iconPath = this.getIconPathOfItemId(itemId);
		const jobName = this.getJobNameById(recipeData.job);
		
		// gathering level stuff
		const gatheringLevel = this.getGatheringLevelById(itemId);
		let gathering = null;
		if(gatheringLevel) { // vitest is saying its not seeing these lines idk
			const gatheringTypes = this.getGatheringTypesById(itemId);
			gathering = {
				level: gatheringLevel,
				types: gatheringTypes || [],
				locations: this.getGatheringLocationsById(itemId) || []
			}

			// add level requirements to additional data
			gatheringTypes.forEach((type) => {
				const found = additionalData.levelRequirements.find((req) => req.name === type.name);
				if(found === undefined) {
					additionalData.levelRequirements.push({
						name: type.name,
						level: gatheringLevel
					});
				} else {
					if(found.level < gatheringLevel) {
						found.level = gatheringLevel;
					}
				}
			});
		}

		let dropSources = null;
		const dropSource = this.getDropSourceById(itemId);
		if(dropSource) {
			dropSources = dropSource;
		}

		let newRecipe = {
			id: itemId,
			amount: recipeData.yields,
			name: itemName || "",
			icon_path: iconPath || "",
			gathering: gathering,
			drop_sources: dropSources,
			crafting: {
				job: recipeData.job,
				job_name: jobName || "",
				level: recipeData.lvl
			},
			ingredients: []
		}
		
		const existingCraftingLevel = additionalData.levelRequirements.find((req) => req.name === recipeData.job);
		if(existingCraftingLevel === undefined) {
			additionalData.levelRequirements.push({
				name: recipeData.job,
				level: recipeData.lvl
			});
		} else {
			const levelReqs = additionalData.levelRequirements.map((req) => {
				if(req.name === recipeData.job) {
					req.level = Math.max(req.level, recipeData.lvl);
				}
				return req;
			})
			
			additionalData = {
				...additionalData,
				...levelReqs
			}
		}
	
		if(recipeData.ingredients.length > 0) {
			for(const ingredient of recipeData.ingredients) {
				const rId = ingredient.id;
				const ingredientName = this.getItemNameFromId(rId) || "???";
				const iconPath = this.getIconPathOfItemId(rId) || undefined;

				const gatheringLevel = this.getGatheringLevelById(rId);
				let gathering = null;
				if(gatheringLevel) { // vitest is saying its not seeing these lines idk
					const gatheringTypes = this.getGatheringTypesById(itemId);
					gathering = {
						level: gatheringLevel,
						types: gatheringTypes || [],
						locations: this.getGatheringLocationsById(itemId) || []
					}

					if(gatheringTypes !== null) {
						// add level requirements to additional data
						gatheringTypes.forEach((type) => {
							const found = additionalData.levelRequirements.find((req) => req.name === type.name);
							if(found === undefined) {
								additionalData.levelRequirements.push({
									name: type.name,
									level: gatheringLevel
								});
							} else {
								if(found.level < gatheringLevel) {
									found.level = gatheringLevel;
								}
							}
						});
					}
				}
						
				const dropSources = this.getDropSourceById(rId);

				let newIngredient = {
					amount: ingredient.amount,
					id: rId,
					name: ingredientName,
					gathering: gathering,
					drop_sources: dropSources,
					icon_path: iconPath,
					crafting: null,
					ingredients: []
				}
	
				const result = this.getRecipeRecursive(rId, additionalData);
				if(result !== null) {
					newIngredient.crafting = result.crafting;
					newIngredient.ingredients = result.ingredients;
				}
				
				newRecipe.ingredients.push(newIngredient);
			}
		}	
		return [newRecipe, additionalData];
	}
}

// const basePath = path.resolve(process.cwd(), 'electron/data/teamcraft');
const basePath = path.resolve(process.cwd(), './teamcraft');
const recipeProvider = new RecipeProvider(basePath);

recipeProvider.init();
console.log("RecipeProvider initialized.");
const ok = async() => {
	const result = await recipeProvider.generateRecipes(basePath);
	console.log("result", JSON.stringify(JSON.parse(result), null, 2));
}
ok();