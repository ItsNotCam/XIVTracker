import { describe, it, expect, afterAll } from "vitest";
import { Recipe } from "../electron/libs/types";
import LuminaParser from "../electron/libs/lumina/LuminaParser";
import { vi } from "vitest";

vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'warn').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

const copperRecipe: Recipe = {
	id: 5062,
	amount: 1,
	quality: 80,
	name: "Copper Ingot",
	icon_path: "none for now",
	ingredients: [{
		id: 5106,
		amount: 3,
		quality: 0,
		name: "Copper Ore",
		ingredients: []
	},{
		id: 4,
		amount: 1,
		quality: 0,
		name: "Wind Shard",
		ingredients: []
	}]
}

const mapleLongbowRecipe = {
	name: "Maple Longbow",
	ingredients: [{
		amount: 1,
		name: "Maple Lumber",
		ingredients: [{
			amount: 3,
			name: "Maple Log",
		},{
			amount: 1,
			name: "Wind Shard"
		}]
	},{
		amount: 1,
		name: "Maple Branch",
	},{
		amount: 1,
		name: "Hempen Yarn",
		ingredients: [{
			amount: 2,
			name: "Moko Grass"
		},{
			amount: 1,
			name: "Lightning Shard"
		}]
	},{
		amount: 1,
		name: "Wind Shard",
	},{
		amount: 1,
		name: "Ice Shard",
	}]
}

const brassIngotRecipe: Recipe = {
	id: 5063,
	amount: 1,
	quality: 264,
	name: "Brass Ingot",
	icon_path: "none for now",
	ingredients: [{
		id: 5106,
		amount: 2,
		quality: 0,
		name: "Copper Ore",
		ingredients: []
	},{
		id: 5110,
		amount: 1,
		quality: 0,
		name: "Zinc Ore",
		ingredients: []
	},{
		id: 4,
		amount: 1,
		quality: 0,
		name: "Wind Shard",
	}]
}

const oakLumberRecipe = {
	name: "Oak Lumber",
	ingredients: [{
		name: "Oak Log",
		amount: 3,
	},{
		name: "Wind Shard",
		amount: 3
	}]
}

const growthFormulaGammaRecipe = {
	name: "Growth Formula Gamma",
	ingredients: [{
		name: "Blue Landtrap Leaf",
		amount: 1,
	},{
		name: "Quicksilver",
		amount: 1,
		ingredients: [{
			name: "Cinnabar",
			amount: 2
		},{
			name: "Water Shard",
			amount: 1
		}]
	},{
		name: "Rock Salt",
		amount: 1
	},{
		name: "Water Shard",
		amount: 3
	}]
}

const cottonYarnRecipe = {
	name: "Cotton Yarn",
	ingredients: [{
		name: "Cotton Boll",
		amount: 2
	},{
		name: "Lightning Shard",
		amount: 1
	}]
}

const pastoralOakCaneRecipe = {
	name: "Pastoral Oak Cane",
	amount: 1,
	ingredients: [
		oakLumberRecipe,
		growthFormulaGammaRecipe,
		brassIngotRecipe,
	{
		name: "Scalekin Blood",
		amount: 1,
		ingredients: []
	},
		cottonYarnRecipe,{
		name: "Wind Shard",
		amount: 4
	},{
		name: "Ice Shard",
		amount: 4
	}]
}

const parser = await new LuminaParser().init();

describe("Invalid Recipes", async () => {
	it("Copper Ore", async() => {
		const result = await parser.getRecipeByItemName("Copper Ore").catch(() => undefined);
		expect(result).toEqual(null);
	});

	it("Zinc Ore", async() => {
		const result = await parser.getRecipeByItemName("Zinc Ore").catch(() => undefined);
		expect(result).toEqual(null);
	});
});

describe("Small Recipes", async () => {
	it("Copper Ingot", async() => {
		const result = await parser.getRecipeByItemName("Copper Ingot").catch(() => undefined);
		expect(result).toStrictEqual(copperRecipe);
	});

	it("Brass Ingot", async() => {
		const result = await parser.getRecipeByItemName("Brass Ingot").catch(() => undefined);
		expect(result).toMatchObject(brassIngotRecipe);
	});

	it("Maple Lumber", async() => {
		const result = await parser.getRecipeByItemName("Maple Lumber").catch(() => undefined);
		const mapleLumberRecipe = {
			...mapleLongbowRecipe.ingredients[0],
			amount: 1
		}

		expect(result).toMatchObject(mapleLumberRecipe);
	});


	it("Hempen Yarn", async() => {
		const result = await parser.getRecipeByItemName("Hempen Yarn").catch(() => undefined);
		const hempenYarnRecipe = {
			...mapleLongbowRecipe.ingredients[2],
			amount: 2
		}
		expect(result).toMatchObject(hempenYarnRecipe);
	});

	it("Oak Lumber", async() => {
		const result = await parser.getRecipeByItemName("Oak Lumber").catch(() => undefined);
		expect(result).toMatchObject(oakLumberRecipe);
	});
	
	it("Cotton Yarn", async() => {
		const result = await parser.getRecipeByItemName("Cotton Yarn").catch(() => undefined);
		expect(result).toMatchObject(cottonYarnRecipe);
	});

	it("Growth Formula Gamma", async() => {
		const result = await parser.getRecipeByItemName("Growth Formula Gamma").catch(() => undefined);
		expect(result).toMatchObject(growthFormulaGammaRecipe);
	});
});

describe('Large Recipes', () => { 
	it("Maple Longbow", async() => {
		const result = await parser.getRecipeByItemName("Maple Longbow").catch(() => undefined);
		expect(result).toMatchObject(mapleLongbowRecipe);
	});
	
	it("Pastoral Oak Cane", async() => {
		const result = await parser.getRecipeByItemName("Pastoral Oak Cane").catch(() => undefined);
		expect(result).toMatchObject(pastoralOakCaneRecipe);
	});
})

afterAll(async () => {
	await parser.close();
});