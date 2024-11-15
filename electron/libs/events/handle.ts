import { BrowserWindow, IpcRendererEvent } from "electron";
import { handle } from "./eventHelpers";
import EzWs from "../net/EzWs";
import { EzFlag } from "../net/ez/EzTypes.d";
import { JobState, Location, Recipe } from "../types.d";
import { promises as fs } from 'fs';
import path from "path";
import { rimraf } from "rimraf";

export class LuminaParser {
	private files: Map<string, any> = new Map<string, any>();
	
	constructor() {}

	public async init(): Promise<LuminaParser> {
		const dataTypes: string[] = [
			"items", "item-id-by-name", "recipe-by-id"
		]
    for (const [i, dt] of dataTypes.entries()) {
			console.log(`${i}: ${dt}`);
			const data = await this.getData(dt);
			this.files.set(dt, data);
			console.log("got data for", dt);
		}

		return this;
	}

	public getItemNameFromId(itemId: number): string {
		const items = this.files.get("items");
		if(items.hasOwnProperty(itemId)) {
			return items[itemId].en;
		}

		throw("No item with that id exists");
	}

	public async getIdFromItemName(itemName: string): Promise<number> {
		const items = await this.getData("item-id-by-name");
		if(!items) {
			throw("No items found in parser");
		}

		if(items.hasOwnProperty(itemName)) {
			return items[itemName];
		}

		throw("No item with that name exists");
	}

	public getRecipe(recipeId: number): any {
		const items = this.files.get("recipe-by-id");
		return items[recipeId];
	}

	public async getData(dataType: string): Promise<any> {
		if(this.files.has(dataType)) {
			return this.files.get(dataType);
		}

		const filepath = path.resolve(__dirname, `../../data/${dataType}.json`);
		console.log("Datatype", dataType, "not found - loading its file:", filepath)
		
		const data: any = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	}
}

const getRecipeRecursive = async (itemIdentifier: string | number, parser: LuminaParser, amount?: number): Promise<Recipe> => {
	let itemId = 0;
	if(typeof itemIdentifier === "string") {
		itemId = await parser.getIdFromItemName(itemIdentifier);
	} else {
		itemId = itemIdentifier;
	}

	const recipeData = parser.getRecipe(itemId);
	if(!recipeData) {
		throw("No recipe data found")
	}

	const itemName = parser.getItemNameFromId(itemId);
	const ingredientAmount = amount || recipeData.yields;
	console.log("found item", itemName);
	let newRecipe: Recipe = {
		id: itemId,
		amount: ingredientAmount,
		quality: recipeData.quality,
		name: itemName,
		icon_path: "none for now",
		ingredients: []
	}

	if(recipeData.ingredients.length > 0) {
		console.log("has more ingredients", recipeData.ingredients)
		for(const ingredient of recipeData.ingredients) {
			const rId = (ingredient as unknown as Recipe).id;
			console.log(rId)

			const ingredientName = await parser.getItemNameFromId(rId);
			let r: Recipe = {
				amount: ingredient.amount,
				id: rId,
				quality: ingredient.quality,
				name: ingredientName,
				ingredients: []
			}

			try {
				r = await getRecipeRecursive(rId, parser, ingredient.amount);
				console.log("ingredient",rId,r);
			} catch(e) {
				console.log(e);
			}
			
			newRecipe.ingredients?.push(r);
		}
	}	
	return newRecipe;
}

export async function getRecipeByItemName(itemName: string): Promise<Recipe> {
	const luminaParser = await new LuminaParser().init();
	const finalRecipe = await getRecipeRecursive(itemName, luminaParser);
	return finalRecipe;
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, WebSocketClient: EzWs) {
	handle("ask:recipe", ipcMain, async (event: IpcRendererEvent, itemName: string): Promise<Recipe> => {
		return new Promise(async(resolve, reject) => {
			const recipe = await getRecipeByItemName(itemName).catch(reject);
			if(!recipe) { 
				reject("No recipe found");
			} else {
				resolve(recipe);
			}
		})
	});

	handle("ask:job-main", ipcMain, async (): Promise<JobState | undefined> => {
		const response = await WebSocketClient.sendAndAwaitResponse(EzFlag.JOB_MAIN);
		if (response === undefined) {
			return undefined;
		}

		try {
			return JobState.fromJson(response);
		} catch (e) {
			console.log("Error parsing job data:", (e as any).message);
		}

		return undefined;
	});

	handle("ask:location-all", ipcMain, async (): Promise<Location | undefined> => {
		const response = await WebSocketClient.sendAndAwaitResponse(EzFlag.LOCATION_ALL);
		if (response === undefined) {
			return undefined;
		}	

		try {
			return JSON.parse(response);
		} catch(e) {
			console.log("Error parsing location data:", (e as any).message);
		}

		return undefined;
	});

	// ipcMain.handle("get-location", async (): Promise<JobState | undefined> => {
	// 	if(!TcpClient.isConnected) {
	// 		throw new Error("No connection available");
	// 	}

	// 	let response;
	// 	try {
	// 		response = await TcpClient.getData(EzFlags.LOCATION.ALL);
	// 		return response && JSON.parse(response.toString());
	// 	} catch(e) {
	// 		if(response) {
	// 			console.log(response!.toString());
	// 		}
	// 		console.log("Error getting location data:", (e as any).message)
	// 		return undefined;
	// 	}
	// });

	handle("ask:tcp-connected", ipcMain, () => {
		return WebSocketClient?.isConnected() || false;
	});

	ipcMain.on('exit', () => {
		win.close();
	});

	ipcMain.on('minimize', () => {
		win.isMinimized() ? win.restore() : win.minimize()
	});

	ipcMain.on('maximize', () => {
		win.isMaximized() ? win.unmaximize() : win.maximize();
	});
}