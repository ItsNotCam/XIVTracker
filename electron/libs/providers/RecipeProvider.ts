import path from "path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";

export type TCFilename = 
	"items"
| "xiv_item-id-by-name"
| "xiv_recipe-by-id"
| "item-level"
| "item-icons"
| "job-name"
| "xiv_gathering-items-by-id"
| "gathering-search-index"
| "gathering-types"
| "xiv_map-entries-by-id"
| "drop-sources"
| "mobs"
| "xiv_monsters-by-id"
| "places"
| "xiv_nodes-by-item-id";

export default class RecipeProvider {
	private files: Map<TCFilename, any> | null = null;
	
	private readonly dataTypes: TCFilename[] = [
		"items", "xiv_item-id-by-name", "xiv_recipe-by-id", "item-level", "item-icons", "job-name",
		"xiv_gathering-items-by-id", "gathering-search-index", "gathering-types", "xiv_map-entries-by-id",
		"drop-sources", "mobs", "xiv_monsters-by-id", "places", "xiv_nodes-by-item-id"
	]

	constructor() {	}

	public isSetup = (): boolean => this.files !== null;

	public close() {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		this.files!.clear();
		this.files = null;
	}

	public async init(): Promise<RecipeProvider> {
		this.files = new Map<TCFilename, any>();

    for (const [,dt] of this.dataTypes.entries()) {
			try { 
				const data = await this.loadData((dt));
				this.files!.set(dt, data);
			} catch(e) { 
				console.error("Failed to get data for:", dt, e);
			};
		}

		return this;
	}
	
	public initSync(): RecipeProvider {
		this.files! = new Map<TCFilename, any>();

    for (const dt in this.dataTypes) {
			try { 
				const data = this.loadDataSync(this.dataTypes[dt]); 
				this.files!.set(dt as TCFilename, data);
			} catch(e) { 
				console.error("Failed to get data for:", this.dataTypes[dt], e);
			}
		}

		return this;
	}

	public loadDataSync(dataType: TCFilename): any {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files!.has(dataType)) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		if(!fsSync.existsSync(filepath)) {
			throw(new Error("File does not exist: " + filepath));
		}

		const data: any = fsSync.readFileSync(filepath);
		return JSON.parse(data.toString());
	}
	
	public async loadData(dataType: TCFilename): Promise<any> {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files!.has(dataType)) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		const fileExists = await fs.stat(filepath).catch(() => false);
		if(!fileExists) {
			throw new Error("File does not exist: " + filepath);
		}

		const data: any = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	}

	public getItemNameFromId(itemId: number): string | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files!.get("items");
		if(items.hasOwnProperty(itemId)) {
			return items[itemId].en;
		}

		return null;
	}

	public getIdFromItemName(itemName: string): number | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		const items = this.files!.get("xiv_item-id-by-name");
		if(items === undefined) {
			throw(new Error("Items not loaded, " + this.files!.size));
		}

		if(items.hasOwnProperty(itemName)) {
			return items[itemName];
		}

		return null;
	}

	public getRootRecipe(recipeId: number): any | null{
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files!.get("xiv_recipe-by-id");
		if(items.hasOwnProperty(recipeId)) {
			return items[recipeId];
		}

		return null;
	}

	public getRecipeByItemIdentifier(itemIdentifier: string | number): TCRecipe | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		let finalRecipe: TCRecipe | null = null;
		finalRecipe = this.getRecipeRecursive(itemIdentifier);
		return finalRecipe;
	}

	public isCraftable(itemId: number): boolean {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const recipe = this.getRootRecipe(itemId);
		return recipe !== null;
	}

	public getIconPathOfItemId(itemId: number): string | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		
		const items = this.files!.get("item-icons");
		if(items.hasOwnProperty(itemId)) {
			return `https://xivapi.com${items[itemId]}`;
		}

		return null;
	}

	public getJobNameById(jobId: number): string | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const jobs = this.files!.get("job-name");
		if(jobs.hasOwnProperty(jobId.toString())) {
			return jobs[jobId]["en"];
		}

		return null;
	}

	public getGatheringLevelById(itemId: number): number | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const levels = this.files!.get("xiv_gathering-items-by-id");
		if(levels.hasOwnProperty(itemId.toString())) {
			return parseInt(levels[itemId].level);
		}

		return null;
	}

	public getGatheringNameById(itemId: number): string | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const gt = this.files!.get("gathering-types");
		if(gt.hasOwnProperty(itemId.toString())) {
			return gt[itemId.toString()].en;
		}
		return null;
	}

	public getGatheringTypesById(itemId: number): TCGatheringType[] | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const levels = this.files!.get("gathering-search-index");
		const gt = this.files!.get("gathering-types");
		if(levels.hasOwnProperty(itemId.toString())) {
			return levels[itemId].types.map((type: number) => ({
				id: type,
				name: gt[type.toString()]?.en
			}));
		}

		return null
	}

	public getAllDropsOfMob(mobId: number): any {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files!.get("drop-sources");

		let sources: any = [];
		Object.keys(dropSources).forEach((itemId: string) => {
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

	public getMobLocationsById(mobId: number): TCDropSource | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const monsters = this.files!.get("xiv_monsters-by-id");

		const mapEntries = this.files!.get("xiv_map-entries-by-id");
		const zoneEntries = this.files!.get("places");
		
		let data = null;
		if(monsters.hasOwnProperty(mobId.toString())) {
			const monster = monsters[mobId];
			data = monster.positions.map((pos: any) => {
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

	public getDropSourceById(itemId: number): TCDropSource[] | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files!.get("drop-sources");
		if(dropSources === undefined || !dropSources.hasOwnProperty(itemId.toString()) || dropSources[itemId].length === 0) {
			return null;
		}

		const mobs = this.files!.get("mobs");
		const outData = dropSources[itemId].map((source: number) => {
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

	public getGatheringLocationsById(itemId: number): TCGatheringNode[] | null {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const nodes = this.files!.get("xiv_nodes-by-item-id");
		if(nodes === undefined || !nodes.hasOwnProperty(itemId.toString())) {
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

			const mapEntries = this.files!.get("xiv_map-entries-by-id");
			if(mapId !== undefined && mapEntries !== undefined && mapEntries.hasOwnProperty(mapId.toString())) {
				mapName = mapEntries[mapId.toString()].name;
			}

			const zoneEntries = this.files!.get("places");
			if(zoneId !== undefined && zoneEntries !== undefined && zoneEntries.hasOwnProperty(zoneId.toString())) {
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

	public getRecipeRecursive(itemIdentifier: string | number): TCRecipe | null {
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
		
		const gatheringLevel = this.getGatheringLevelById(itemId);
		let gathering: TCGathering | null = null;
		if(gatheringLevel) { // vitest is saying its not seeing these lines idk
			const gatheringTypes = this.getGatheringTypesById(itemId);
			gathering = {
				level: gatheringLevel,
				types: gatheringTypes || [],
				locations: this.getGatheringLocationsById(itemId) || []
			}
		}

		let dropSources = null;
		const dropSource = this.getDropSourceById(itemId);
		if(dropSource) {
			dropSources = dropSource;
		}

		let newRecipe: TCRecipe = {
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
	
		if(recipeData.ingredients.length > 0) {
			for(const ingredient of recipeData.ingredients) {
				const rId = ingredient.id;
				const ingredientName = this.getItemNameFromId(rId) || "???";
				const iconPath = this.getIconPathOfItemId(rId) || undefined;

				const gatheringLevel = this.getGatheringLevelById(rId);
				let gathering: TCGathering | null = null;
				if(gatheringLevel) {
					const gatheringTypes: TCGatheringType[] | null = this.getGatheringTypesById(rId);
					gathering = {
						level: gatheringLevel,
						types: gatheringTypes || [],
						locations: this.getGatheringLocationsById(rId) || []
					}
				}
						
				const dropSources: TCDropSource[] | null = this.getDropSourceById(rId);

				let newIngredient: TCRecipe = {
					amount: ingredient.amount,
					id: rId,
					name: ingredientName,
					gathering: gathering,
					drop_sources: dropSources,
					icon_path: iconPath,
					crafting: null,
					ingredients: []
				}
	
				const result = this.getRecipeRecursive(rId);
				if(result !== null) {
					newIngredient.crafting = result.crafting;
					newIngredient.ingredients = result.ingredients;
				}
				
				newRecipe.ingredients.push(newIngredient);
			}
		}	
		return newRecipe;
	}
}
