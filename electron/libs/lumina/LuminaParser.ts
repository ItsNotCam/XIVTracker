import path from "path";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { Recipe } from "@electron-lib/types";

export default class LuminaParser {
	private files: Map<string, any> = new Map<string, any>();
	
	constructor() {}

	public async init(): Promise<LuminaParser> {
		const dataTypes: string[] = [
			"items", "item-id-by-name", "recipe-by-id"
		]

    for (const [,dt] of dataTypes.entries()) {
			const data = await this.getData(dt);
			this.files.set(dt, data);
		}

		return this;
	}

	public initSync(): LuminaParser {
		const dataTypes: string[] = [
			"items", "item-id-by-name", "recipe-by-id"
		]

    for (const [,dt] of dataTypes.entries()) {
			const data = this.getDataSync(dt);
			this.files.set(dt, data);
		}

		return this;
	}

	public close() {
		this.files.clear();
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
		if(!fsSync.existsSync(filepath)) {
			throw("File does not exist: " + filepath);
		}

		const data: any = await fs.readFile(filepath);
		return JSON.parse(data.toString());
	}

	public async getDataSync(dataType: string): Promise<any> {
		if(this.files.has(dataType)) {
			return this.files.get(dataType);
		}

		const filepath = path.resolve(__dirname, `../../data/${dataType}.json`);
		if(!fsSync.existsSync(filepath)) {
			throw("File does not exist: " + filepath);
		}

		const data: any = fsSync.readFileSync(filepath);
		return JSON.parse(data.toString());
	}

	public async getRecipeByItemName(itemName: string): Promise<Recipe | null> {
		let finalRecipe: Recipe | null = null;
		try {
			finalRecipe = await this.getRecipeRecursive(itemName);
		} catch(e) {
			console.log(e);
		}

		return finalRecipe;
	}

	public async getRecipeRecursive(itemIdentifier: string | number, amount?: number): Promise<any> {
		let itemId = 0;
		if(typeof itemIdentifier === "string") {
			itemId = await this.getIdFromItemName(itemIdentifier);
		} else {
			itemId = itemIdentifier;
		}
	
		const recipeData = this.getRecipe(itemId);
		if(!recipeData) {
			throw("No recipe data found for item id: " + itemId);
		}
	
		const itemName = this.getItemNameFromId(itemId);
		const ingredientAmount = amount || recipeData.yields;
		let newRecipe: Recipe = {
			id: itemId,
			amount: ingredientAmount,
			quality: recipeData.quality,
			name: itemName,
			icon_path: "none for now",
			ingredients: []
		}
	
		if(recipeData.ingredients.length > 0) {
			for(const ingredient of recipeData.ingredients) {
				const rId = (ingredient as unknown as Recipe).id;
				const ingredientName = await this.getItemNameFromId(rId);
				let r: Recipe = {
					amount: ingredient.amount,
					id: rId,
					quality: ingredient.quality,
					name: ingredientName,
					ingredients: []
				}
	
				try {
					r = await this.getRecipeRecursive(rId, ingredient.amount);
				} catch(e) {
					console.log(e);
				}
				
				newRecipe.ingredients?.push(r);
			}
		}	
		return newRecipe;
	}
}
