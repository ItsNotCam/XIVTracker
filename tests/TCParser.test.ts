import { it, expect, afterAll, suite, beforeEach, beforeAll, test } from "vitest";
import TeamCraftParser from "../electron/libs/lumina/TeamCraftParser";

// vi.spyOn(console, 'log').mockImplementation(() => {});
// vi.spyOn(console, 'warn').mockImplementation(() => {});
// vi.spyOn(console, 'error').mockImplementation(() => {});

const copperRecipe = {
	id: 5062,
	amount: 1,
	name: "Copper Ingot",
	ingredients: [{
		id: 5106,
		amount: 3,
		name: "Copper Ore",
		ingredients: []
	},{
		id: 4,
		amount: 1,
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

const brassIngotRecipe = {
	id: 5063,
	amount: 1,
	name: "Brass Ingot",
	ingredients: [{
		id: 5106,
		amount: 2,
		name: "Copper Ore",
		ingredients: []
	},{
		id: 5110,
		amount: 1,
		name: "Zinc Ore",
		ingredients: []
	},{
		id: 4,
		amount: 1,
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


let parser: TeamCraftParser;
beforeAll(async () => {
	parser = await new TeamCraftParser().init();
})

suite("Invalid operations", async () => {
	test("Try to access invalid parser", async() => {
		const invalidParser = new TeamCraftParser();
		expect(() => invalidParser.getJobNameById(1)).toThrow("Parser not initialized");
	});

	test("Try to open an invalid path", async() => {
		const result = await parser.loadData("haha ok").catch(() => undefined);
		expect(result).toBe(undefined);
	});

	test("Try to load already loaded data", async() => {
		const result = await parser.loadData("drop-sources").catch(() => undefined);
		expect(result).toBe(undefined);
	});

	test("Try to get item name with invalid ID", async() => {
		expect(parser.getItemNameFromId(-1)).toBe(null);
	});

	test("Try to get recipe with invalid item name", async() => {
		expect(parser.getRecipeByItemIdentifier("")).toBe(null);
	});

	test("Try to get gathering name by invalid id", async() => {
		expect(parser.getRecipeByItemIdentifier(-1)).toBe(null);
	});

	test("Try to get icon path of invalid item id", async() => {
		expect(parser.getIconPathOfItemId(-1)).toBe(null);
	});

	test("Try to get recipe with invalid item id", async() => {
		expect(parser.getRecipeByItemIdentifier(-1)).toBe(null);
	});

	test("Try to get gathering types by invalid id", async() => {
		expect(parser.getGatheringTypesById(-1)).toBe(null);
	});

	test("Try to get gathering name by invalid id", async() => {
		expect(parser.getGatheringNameById(-1)).toBe(null);
	});

	it("Try to get item name from invalid", async() => {
		expect(parser.getItemNameFromId(-1)).toBe(null);
	});
});

suite("Get Item Information", async () => {
	it("Test All Item Ids", () => {
		for(let i = 1; i < 45700; i++) {
			const result = parser.getItemNameFromId(i);
			expect(result).not.toEqual(null);
		}
	});

	it("Test Random Valid Recipes", () => {
		for (let i = 0; i < 50; i++) {
			const randomItems: number[] = [];
			while(randomItems.length < 5) {
				const randomId = Math.floor(Math.random() * 45700);
				if(parser.isCraftable(randomId) && !randomItems.includes(randomId)) {
					randomItems.push(randomId);
				}
			}

			randomItems.forEach(id => {
				expect(parser.getRecipeByItemIdentifier(id)).not.toStrictEqual(null)
			});
		}
	});
});

suite("Invalid Recipes", () => {
	it("Copper Ore",() => {
		const result = parser.getRecipeByItemIdentifier("Copper Ore");
		expect(result).toEqual(null);
	});

	it("Zinc Ore",() => {
		const result = parser.getRecipeByItemIdentifier("Zinc Ore");
		expect(result).toEqual(null);
	});

	it("Tree nut",() => {
		const result = parser.getRecipeByItemIdentifier("Tree nut");
		expect(result).toEqual(null);
	});
});

suite("Small Recipes", () => {
	it("Copper Ingot",() => {
		const result = parser.getRecipeByItemIdentifier("Copper Ingot");
		expect(result).toMatchObject(copperRecipe);
	});

	it("Brass Ingot",() => {
		const result = parser.getRecipeByItemIdentifier("Brass Ingot");
		expect(result).toMatchObject(brassIngotRecipe);
	});

	it("Maple Lumber",() => {
		const result = parser.getRecipeByItemIdentifier("Maple Lumber");
		const mapleLumberRecipe = {
			...mapleLongbowRecipe.ingredients[0],
			amount: 1
		}

		expect(result).toMatchObject(mapleLumberRecipe);
	});


	it("Hempen Yarn",() => {
		const result = parser.getRecipeByItemIdentifier("Hempen Yarn");
		const hempenYarnRecipe = {
			...mapleLongbowRecipe.ingredients[2],
			amount: 2
		}
		expect(result).toMatchObject(hempenYarnRecipe);
	});

	it("Oak Lumber",() => {
		const result = parser.getRecipeByItemIdentifier("Oak Lumber");
		expect(result).toMatchObject(oakLumberRecipe);
	});
	
	it("Cotton Yarn",() => {
		const result = parser.getRecipeByItemIdentifier("Cotton Yarn");
		expect(result).toMatchObject(cottonYarnRecipe);
	});

	it("Growth Formula Gamma",() => {
		const result = parser.getRecipeByItemIdentifier("Growth Formula Gamma");
		expect(result).toMatchObject(growthFormulaGammaRecipe);
	});
});

suite('Large Recipes', () => { 
	it("Maple Longbow",() => {
		const result = parser.getRecipeByItemIdentifier("Maple Longbow");
		expect(result).toMatchObject(mapleLongbowRecipe);
	});
	
	it("Pastoral Oak Cane",() => {
		const result = parser.getRecipeByItemIdentifier("Pastoral Oak Cane");
		expect(result).toMatchObject(pastoralOakCaneRecipe);
	});
})

suite("AI Generated Tests", () => {
	it("Test valid item name retrieval", () => {
		const itemName = parser.getItemNameFromId(5062);
		expect(itemName).toBe("Copper Ingot");
	});

	it("Test valid recipe retrieval by item name", () => {
		const recipe = parser.getRecipeByItemIdentifier("Copper Ingot");
		expect(recipe).toMatchObject(copperRecipe);
	});

	it("Test valid recipe retrieval by item id", () => {
		const recipe = parser.getRecipeByItemIdentifier(5062);
		expect(recipe).toMatchObject(copperRecipe);
	});

	it("Test valid gathering name retrieval", () => {
		const gatheringName = parser.getGatheringNameById(1);
		expect(gatheringName).not.toBe(null);
	});

	it("Test valid icon path retrieval", () => {
		const iconPath = parser.getIconPathOfItemId(5062);
		expect(iconPath).not.toBe(null);
	});

	it("Test isCraftable method with valid id", () => {
		const isCraftable = parser.isCraftable(5062);
		expect(isCraftable).toBe(true);
	});

	it("Test isCraftable method with invalid id", () => {
		const isCraftable = parser.isCraftable(-1);
		expect(isCraftable).toBe(false);
	});
});

afterAll(async () => {
	await parser.close();
});