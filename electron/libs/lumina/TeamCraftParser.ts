import path from "path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { TCDropSource, TCGathering, TCGatheringType, TCGatheringNode, TCRecipe } from "./TeamCraftTypes";

export default class TeamCraftParser {
	private files: Map<string, any> | null = null;
	
	constructor() {	}

	public async init(): Promise<TeamCraftParser> {
		this.files! = new Map<string, any>();

		const dataTypes: string[] = [
			"items", "item-id-by-name", "recipe-by-id", "item-level", "item-icons", "job-name",
			"gathering-items-by-id", "gathering-search-index", "gathering-types", "map-entries-by-id",
			"drop-sources", "mobs", "monsters-by-id", "places", "nodes-by-item-id"
		]

    for (const [,dt] of dataTypes.entries()) {
			const data = await this.loadData(dt);
			this.files!.set(dt, data);
		}

		return this;
	}

	private validate() {
		if(this.files === null) {
			throw("Parser not initialized");
		}
	}

	public close() {
		this.validate();
		this.files!.clear();
	}

	public getItemNameFromId(itemId: number): string | null {
		this.validate();

		const items = this.files!.get("items");
		if(items.hasOwnProperty(itemId)) {
			return items[itemId].en;
		}

		return null;
	}

	public getIdFromItemName(itemName: string): number | null {
		this.validate();

		const items = this.files?.get("item-id-by-name");
		if(items.hasOwnProperty(itemName)) {
			return items[itemName];
		}

		return null;
	}

	private getRootRecipe(recipeId: number): any | null{
		this.validate();

		const items = this.files!.get("recipe-by-id");
		if(items.hasOwnProperty(recipeId)) {
			return items[recipeId];
		}

		return null;
	}

	public async loadData(dataType: string): Promise<any> {
		this.validate();

		if(this.files!.has(dataType)) {
			throw(new Error("Data already loaded: " + dataType));
		}

		const filepath = path.resolve(__dirname, `../../data/${dataType}.json`);
		const fileExists = await fs.stat(filepath).catch(() => false);
		if(!fileExists) {
			return Promise.reject(new Error("File does not exist: " + filepath));
		}

		const data: any = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	}

	public getRecipeByItemIdentifier(itemIdentifier: string | number): TCRecipe | null {
		this.validate();

		let finalRecipe: TCRecipe | null = null;
		finalRecipe = this.getRecipeRecursive(itemIdentifier);
		return finalRecipe;
	}

	public isCraftable(itemId: number): boolean {
		this.validate();

		const recipe = this.getRootRecipe(itemId);
		return recipe !== null;
	}

	public getIconPathOfItemId(itemId: number): string | null {
		this.validate();
		
		const items = this.files!.get("item-icons");
		if(items.hasOwnProperty(itemId)) {
			return `https://xivapi.com${items[itemId]}`;
		}

		return null;
	}

	public getJobNameById(jobId: number): string | null {
		this.validate();

		const jobs = this.files!.get("job-name");
		if(jobs.hasOwnProperty(jobId.toString())) {
			return jobs[jobId]["en"];
		}

		return null;
	}

	public getGatheringLevelById(itemId: number): number | null {
		this.validate();

		const levels = this.files!.get("gathering-items-by-id");
		if(levels.hasOwnProperty(itemId.toString())) {
			return parseInt(levels[itemId].level);
		}

		return null;
	}

	public getGatheringNameById(itemId: number): string | null {
		this.validate();

		const gt = this.files!.get("gathering-types");
		if(gt.hasOwnProperty(itemId.toString())) {
			return gt[itemId.toString()].en;
		}
		return null;
	}

	public getGatheringTypesById(itemId: number): TCGatheringType[] | null {
		this.validate();

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
		this.validate();

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
		this.validate();

		const monsters = this.files!.get("monsters-by-id");

		const mapEntries = this.files!.get("map-entries-by-id");
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
		this.validate();

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
		this.validate();

		const nodes = this.files!.get("nodes-by-item-id");
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

			const mapEntries = this.files!.get("map-entries-by-id");
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
		this.validate();

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

		let newRecipe: any = {
			id: itemId,
			amount: recipeData.yields,
			name: itemName,
			icon_path: iconPath,
			gathering: gathering,
			drop_sources: dropSources,
			crafting: {
				job: recipeData.job,
				job_name: jobName,
				level: Math.max(recipeData.lvl, recipeData.rlvl)
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
