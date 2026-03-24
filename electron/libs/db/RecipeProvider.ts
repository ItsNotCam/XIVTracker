import path from "path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { TCDropSource, TCGathering, TCGatheringNode, TCGatheringType, TCRecipe } from "@xiv-types";

export type TCDataType = 
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

export default class RecipeProvider implements Disposable {
	private files: Map<TCDataType, unknown>;
	
	private readonly dataTypes: TCDataType[] = [
		"items", "xiv_item-id-by-name", "xiv_recipe-by-id", "item-level", "item-icons", "job-name",
		"xiv_gathering-items-by-id", "gathering-search-index", "gathering-types", "xiv_map-entries-by-id",
		"drop-sources", "mobs", "xiv_monsters-by-id", "places", "xiv_nodes-by-item-id"
	]

	constructor() {
		this.files = new Map<TCDataType, unknown>();
	}

	public isSetup = (): boolean => this.files !== null;

	public [Symbol.dispose] = () => {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}
		this.files.clear();
	}

	public init = async(): Promise<RecipeProvider> => {
		this.files = new Map<TCDataType, unknown>();

    for (const [,dt] of this.dataTypes.entries()) {
			try { 
				const data = await this.loadData((dt));
				this.files.set(dt, data);
			} catch(e) { 
				console.error("Failed to get data for:", dt, e);
			}
		}

		return this;
	}
	
	public initSync = (): RecipeProvider => {
		this.files = new Map<TCDataType, unknown>();

    for (const dt of this.dataTypes) {
			try {
				const data = this.loadDataSync(dt);
				this.files.set(dt, data);
			} catch(e) {
				console.error("Failed to get data for:", dt, e);
			}
		}

		return this;
	}

	public loadDataSync = (dataType: TCDataType): unknown => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files.has(dataType)) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		if(!fsSync.existsSync(filepath)) {
			throw(new Error("File does not exist: " + filepath));
		}

		const data = fsSync.readFileSync(filepath);
		return JSON.parse(data.toString());
	}
	
	public loadData = async(dataType: TCDataType): Promise<unknown> => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		if(this.files.has(dataType)) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const processPath = process.cwd();
		const filepath = path.resolve(`${processPath}/electron/data/teamcraft/${dataType}.json`);
		const fileExists = await fs.stat(filepath).catch(() => false);
		if(!fileExists) {
			throw new Error("File does not exist: " + filepath);
		}

		const data = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	}

	public getItemNameFromId =(itemId: number): string | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files.get("items") as { en: string }[];
		if(items && items[itemId]) {
			return items[itemId]?.en;
		}

		return null;
	}

	public getIdFromItemName = (itemName: string): number | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files.get("xiv_item-id-by-name") as Record<string, number> | null;
		if(!items) {
			throw(new Error("Items not loaded, " + this.files.size));
		}

		return items[itemName] ?? null;
	}

	public getRootRecipe = (recipeId: number): any | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const items = this.files.get("xiv_recipe-by-id") as Record<string, any> | undefined;
		if(!items) return null;

		return items[recipeId] ?? null;
	}

	public getRecipeByItemIdentifier = (itemIdentifier: string | number): TCRecipe | null => {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		let finalRecipe: TCRecipe | null = null;
		finalRecipe = this.getRecipeRecursive(itemIdentifier);
		return finalRecipe;
	}

	public isCraftable = (itemId: number): boolean => {
		if(!this.isSetup()) {
			throw(new Error("Parser not initialized"));
		}

		const recipe = this.getRootRecipe(itemId);
		return recipe !== null;
	}

	public getIconPathOfItemId = (itemId: number): string | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}
		
		const items = this.files.get("item-icons") as Record<string, string> | null;
		if(items && items[itemId]) {
			return `https://xivapi.com${items[itemId]}`;
		}

		return null;
	}

	public getJobNameById = (jobId: number): string | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const jobs = this.files.get("job-name") as Record<string,{ en: string }> | null;
		if(jobs && jobs[jobId]) {
			return jobs[jobId]["en"];
		}

		return null;
	}

	public getGatheringLevelById = (itemId: number): number | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const levels = this.files.get("xiv_gathering-items-by-id") as Record<string, { level: string }> | null;
		if(levels && levels[itemId]) {
			return parseInt(levels[itemId]?.level);
		}

		return null;
	}

	public getGatheringNameById = (itemId: number): string | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const gt = this.files.get("gathering-types") as Record<string, { en: string }> | null;
		if(gt && gt[itemId]) {
			return gt[itemId]?.en;
		}
		return null;
	}

	public getGatheringTypesById = (itemId: number): TCGatheringType[] | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const gt = this.files.get("gathering-types") as Record<string, { en: string }> | null;
		const levels = this.files.get("gathering-search-index") as Record<string, { types: number[] }>;

		if(gt && levels && levels[itemId]) {
			return levels[itemId].types.map((type: number) => ({
				id: type,
				name: gt[type]?.en
			}));
		}

		return null
	}

	public getAllDropsOfMob = (mobId: number): any => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files.get("drop-sources") as Record<string, number[]> | null;
		if(!dropSources) {
			throw new Error("Drop sources not loaded");
		}

		const sources: any = [];
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

	public getMobLocationsById = (mobId: number): TCDropSource[] | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const monsters = this.files.get("xiv_monsters-by-id") as Record<string, { positions: any}> | null;

		const mapEntries = this.files.get("xiv_map-entries-by-id") as Record<string, { name: string }> | null;
		const zoneEntries = this.files.get("places") as Record<string, { en: string }> | null;
		
		if(!monsters || !mapEntries || !zoneEntries || !monsters[mobId]) {
			return null;
		}

		const monster = monsters[mobId];
		const data: TCDropSource[] = monster.positions.map((pos: any) => {
			const mapId = pos.map;
			const zoneId = pos.zoneid;

			const mapName = mapEntries[mapId]?.name;
			const zoneName = zoneEntries[zoneId]?.en;

			return {
				...pos,
				map_name: mapName,
				zone_name: zoneName
			}
		});

		return data;
	}

	public getDropSourceById = (itemId: number): TCDropSource[] | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const dropSources = this.files.get("drop-sources") as Record<string, number[]> | null;
		if(!dropSources || !dropSources[itemId] || dropSources[itemId].length === 0) {
			return null;
		}

		const mobs = this.files.get("mobs") as Record<string, { en: string }> | null;
		const outData = dropSources[itemId].map((source: number) => {
			const mobId = source;
			const mobName = mobs ? mobs[source]?.en : null;

			const allDrops = this.getAllDropsOfMob(mobId);
			const positions = this.getMobLocationsById(mobId);
			
			const dropSource: TCDropSource = {
				id: mobId,
				name: mobName ?? "?",
				drops: allDrops,
				positions: positions?.flatMap((p) => p.positions) ?? []
			}

			return dropSource;
		});

		return outData;
	}

	public getGatheringLocationsById = (itemId: number): TCGatheringNode[] | null => {
		if(!this.isSetup() || !this.files) {
			throw(new Error("Parser not initialized"));
		}

		const nodes = this.files.get("xiv_nodes-by-item-id") as Record<string, any[]>;
		if(nodes === undefined || !nodes[itemId]) {
			console.log("No nodes found for item id: " + itemId);
			return null;
		}

		const outData = []
		const nodeData = nodes[itemId.toString()];
		for(const node of nodeData) {
			const mapId = node.map;
			const zoneId = node.zoneid;

			let mapName = "";
			let zoneName = "";

			const mapEntries = this.files.get("xiv_map-entries-by-id") as Record<string, { name: string }>
			if(mapId && mapEntries && mapEntries[mapId]) {
				mapName = mapEntries[mapId]?.name
			}

			const zoneEntries = this.files.get("places") as Record<string, { en: string}>;
			if(zoneId && zoneEntries && zoneEntries[zoneId]) {
				zoneName = zoneEntries[zoneId]?.en
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

	public getRecipeRecursive = (
		itemIdentifier: string | number, 
		parentAmount: number = 1, 
		depth: number = 0
	): TCRecipe | null => {
		if(!this.isSetup() || !this.files) {
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
	
		const rootRecipe = this.getRootRecipe(itemId);
		if(!rootRecipe) {
			return null;
		}

		const amountNeeded = Math.ceil(parentAmount / (rootRecipe.yields || 1));
		const itemName = this.getItemNameFromId(itemId);
		const iconPath = this.getIconPathOfItemId(itemId);
		const jobName = this.getJobNameById(rootRecipe.job);
		
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

		const newRecipe: TCRecipe = {
			id: itemId,
			amount: amountNeeded,
			name: itemName || "",
			icon_path: iconPath || "",
			gathering: gathering,
			drop_sources: dropSources,
			crafting: {
				job: rootRecipe.job,
				job_name: jobName || "",
				level: rootRecipe.lvl
			},
			ingredients: []
		}
	
		if(rootRecipe.ingredients.length > 0) {
			for(const ingredient of rootRecipe.ingredients) {
				const rId = ingredient.id;
				const ingredientName = this.getItemNameFromId(rId) || "???";
				const iconPath = this.getIconPathOfItemId(rId) || undefined;

				const gatheringLevel = this.getGatheringLevelById(rId);
				let gathering: TCGathering | null = null;
				if(gatheringLevel) {
					gathering = {
						level: gatheringLevel,
						types: this.getGatheringTypesById(rId) || [],
						locations: this.getGatheringLocationsById(rId) || []
					}
				}
						
				const dropSources: TCDropSource[] | null = this.getDropSourceById(rId);

				const newIngredient: TCRecipe = {
					id: rId,
					amount: amountNeeded * ingredient.amount,
					name: ingredientName,
					gathering: gathering,
					drop_sources: dropSources,
					icon_path: iconPath,
					crafting: null,
					ingredients: []
				}
	
				const result = this.getRecipeRecursive(rId, newIngredient.amount, depth + 1);
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