import { it, expect, afterAll, suite, beforeEach, beforeAll, test, assert } from "vitest";
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

let invalidParser: TeamCraftParser;
let validParser: TeamCraftParser;
beforeAll(async () => {
	validParser = await new TeamCraftParser().init();
	invalidParser = new TeamCraftParser();
})

test("Parsers initialized", () => {
	expect(validParser.isSetup()).toBe(true);
	expect(invalidParser.isSetup()).toBe(false);
});

suite("Setup parser", async () => {
	it("Should setup synchronously", () => {
		const validParser = new TeamCraftParser().initSync();
		expect(validParser.isSetup()).toBe(true);
	});
	
	it("Should setup asynchronously", async () => {
		const validParser = await new TeamCraftParser().init();
		expect(validParser.isSetup()).toBe(true);
	});
	
	it("Should not be set up", async () => {
		const invalidParser = new TeamCraftParser();
		expect(invalidParser.isSetup()).toBe(false);
	});
});

suite("Parser Tests", async () => {
	suite("Open and Close", () => {
		it("Should be able to open", async () => {
			const tempValidParser = await new TeamCraftParser().init();
			expect(tempValidParser.isSetup()).toBe(true);
			tempValidParser.close();
		});

		it("Should be able to close", async () => {
			const tempValidParser = await new TeamCraftParser().init();
			expect(tempValidParser.isSetup()).toBe(true);
			tempValidParser.close();
			expect(tempValidParser.isSetup()).toBe(false);
		});

		it("Should be able to reopen", async () => {
			const tempValidParser = new TeamCraftParser().initSync();
			expect(tempValidParser.isSetup()).toBe(true);
			tempValidParser.close();
			expect(tempValidParser.isSetup()).toBe(false);
			tempValidParser.initSync();
			expect(tempValidParser.isSetup()).toBe(true);
			tempValidParser.close();
			expect(tempValidParser.isSetup()).toBe(false);
		});
		
		it("Should not be able to close", async () => {
			const tempValidParser = await new TeamCraftParser();
			try {
				tempValidParser.close();
				assert.fail("Failed")
			} catch(e) {
				expect(e.message).toBe("Parser not initialized");
			}
		});
	})

	suite("Test with valid parser", async() => {
		test("Try to open an invalid path async", async() => {
			const result = await validParser.loadData("haha ok").catch(() => undefined);
			expect(result).toBe(undefined);
		});

		test("Try to open an invalid path sync", async() => {
			const re: RegExp = new RegExp(/File does not exist: .*/);
			try {
				validParser.loadDataSync("haha ok");
				assert.fail("Failed")
			} catch(e) {
				expect(e.message).toMatch(re);
			}
		});
	
		test("Try to load already loaded data", async() => {
			const result = await validParser.loadData("drop-sources").catch(() => undefined);
			expect(result).toBe(undefined);
		});
	
		test("Try to get item name with invalid ID", async() => {
			expect(validParser.getItemNameFromId(-1)).toBe(null);
		});
		
		test("Try to get id from invalid Name", async() => {
			expect(validParser.getIdFromItemName("nope")).toBe(null);
		});
	
		test("Try to get recipe with invalid item name", async() => {
			expect(validParser.getRecipeByItemIdentifier("")).toBe(null);
		});
	
		test("Try to get gathering name by invalid id", async() => {
			expect(validParser.getRecipeByItemIdentifier(-1)).toBe(null);
		});
	
		test("Try to get icon path of invalid item id", async() => {
			expect(validParser.getIconPathOfItemId(-1)).toBe(null);
		});
	
		test("Try to get recipe with invalid item id", async() => {
			expect(validParser.getRecipeByItemIdentifier(-1)).toBe(null);
		});
	
		test("Try to get gathering types by invalid id", async() => {
			expect(validParser.getGatheringTypesById(-1)).toBe(null);
		});
	
		test("Try to get gathering name by invalid id", async() => {
			expect(validParser.getGatheringNameById(-1)).toBe(null);
		});
	
		it("Try to get item name from invalid", async() => {
			expect(validParser.getItemNameFromId(-1)).toBe(null);
		});

		test("Try to get nodes for non-existing item", async() => {
			expect(validParser.getGatheringLocationsById(4)).not.toBe(null);
		});

		test("Should fail to get data synchronously for an invalid file", async() => {
			const newParser = new TeamCraftParser();
			try {
				newParser.initSync();
			} catch (e) {
				if (/Failed to get data for: .*/.test(e.message)) {
					newParser.close();
				}
				throw e;
			}
		});
	})

	suite("Tests with Invalid Parser", () => {
		it("Test invalid gathering name retrieval", () => {
			expect(() => invalidParser.getGatheringNameById(1)).toThrow("Parser not initialized");
		});

		it("Should fail to get mob locations with invalid parser", () => {
			expect(() => invalidParser.getMobLocationsById(1)).toThrow("Parser not initialized");
		});

		it("Should fail to get id from item name with invalid parser", () => {
			expect(() => invalidParser.getIdFromItemName("Brass Ingot")).toThrow("Parser not initialized");
		});

		it("Should fail to get root recipe with invalid parser", () => {
			expect(() => invalidParser.getRootRecipe(1)).toThrow("Parser not initialized");
		});

		it("Should fail to get mob drops with invalid parser", () => {
			expect(() => invalidParser.getAllDropsOfMob(1)).toThrow("Parser not initialized");
		});

		it("Should fail to get gathering level with invalid parser", () => {
			expect(() => invalidParser.getGatheringLevelById(1)).toThrow("Parser not initialized");
		});

		test("Try to get gathering locations by id from invalid parser", async() => {
			try {
				invalidParser.getGatheringLocationsById(5132);
				assert.fail("Failed")
			} catch(e) {
				expect(e.message).toBe("Parser not initialized");
			}
		});

		test("Try to get drop source id from invalid parser", async() => {
			try {
				invalidParser.getDropSourceById(5132);
				assert.fail("Failed")
			} catch(e) {
				expect(e.message).toBe("Parser not initialized");
			}
		});

		test("Try to get recipe from invalid parser", async() => {
			try {
				invalidParser.getRecipeRecursive(5132);
				assert.fail("Failed")
			} catch(e) {
				expect(e.message).toBe("Parser not initialized");
			}
		});

		it("Test invalid job name retrieval", () => {
			expect(() => invalidParser.getJobNameById(1)).toThrow("Parser not initialized");
		});

		it("Test invalid data loading async", async () => {
			const failed = await invalidParser.loadData("recipes").catch(e => e.message);
			expect(failed).toBe("Parser not initialized");
		});

		it("Test invalid data loading sync", async () => {
			expect(() => invalidParser.loadDataSync("valid-path")).toThrow("Parser not initialized");
		});

		it("Test invalid item name retrieval by id", () => {
			expect(() => invalidParser.getItemNameFromId(5063)).toThrow("Parser not initialized");
		});

		it("Test invalid recipe retrieval by item name", () => {
			expect(() => invalidParser.getRecipeByItemIdentifier("Brass Ingot")).toThrow("Parser not initialized");
		});

		it("Test invalid gathering types retrieval", () => {
			expect(() => invalidParser.getGatheringTypesById(1)).toThrow("Parser not initialized");
		});

		it("Test invalid gathering name retrieval", () => {
			expect(() => invalidParser.getGatheringNameById(1)).toThrow("Parser not initialized");
		});

		it("Test invalid item name retrieval by id", () => {
			expect(() => invalidParser.getItemNameFromId(5062)).toThrow("Parser not initialized");
		});

		it("Test invalid recipe retrieval by item id", () => {
			expect(() => invalidParser.getRecipeByItemIdentifier(5062)).toThrow("Parser not initialized");
		});

		it("Test invalid gathering name retrieval", () => {
			expect(() => invalidParser.getGatheringNameById(1)).toThrow("Parser not initialized");
		});

		it("Test invalid icon path retrieval", () => {
			expect(() => invalidParser.getIconPathOfItemId(5062)).toThrow("Parser not initialized");
		});

		it("Test isCraftable method with invalid parser", () => {
			expect(() => invalidParser.isCraftable(5062)).toThrow("Parser not initialized");
		});

		it("Test isCraftable method with invalid id and invalid parser", () => {
			expect(() => invalidParser.isCraftable(-1)).toThrow("Parser not initialized");
		});
	});
});

suite("Get Item Information", async () => {
	it("Test All Item Ids", () => {
		for(let i = 1; i < 45700; i++) {
			const result = validParser.getItemNameFromId(i);
			expect(result).not.toEqual(null);
		}
	});

	it("Test Random Valid Recipes", () => {
		for (let i = 0; i < 50; i++) {
			const randomItems: number[] = [];
			while(randomItems.length < 5) {
				const randomId = Math.floor(Math.random() * 45700);
				if(validParser.isCraftable(randomId) && !randomItems.includes(randomId)) {
					randomItems.push(randomId);
				}
			}

			randomItems.forEach(id => {
				expect(validParser.getRecipeByItemIdentifier(id)).not.toStrictEqual(null)
			});
		}
	});
});

suite("Invalid Recipes", () => {
	it("Copper Ore",() => {
		const result = validParser.getRecipeByItemIdentifier("Copper Ore");
		expect(result).toEqual(null);
	});

	it("Zinc Ore",() => {
		const result = validParser.getRecipeByItemIdentifier("Zinc Ore");
		expect(result).toEqual(null);
	});

	it("Tree nut",() => {
		const result = validParser.getRecipeByItemIdentifier("Tree nut");
		expect(result).toEqual(null);
	});
});

suite("Small Recipes", () => {
	it("Copper Ingot",() => {
		const result = validParser.getRecipeByItemIdentifier("Copper Ingot");
		expect(result).toMatchObject(copperRecipe);
	});

	it("Brass Ingot",() => {
		const result = validParser.getRecipeByItemIdentifier("Brass Ingot");
		expect(result).toMatchObject(brassIngotRecipe);
	});

	it("Maple Lumber",() => {
		const result = validParser.getRecipeByItemIdentifier("Maple Lumber");
		const mapleLumberRecipe = {
			...mapleLongbowRecipe.ingredients[0],
			amount: 1
		}

		expect(result).toMatchObject(mapleLumberRecipe);
	});


	it("Hempen Yarn",() => {
		const result = validParser.getRecipeByItemIdentifier("Hempen Yarn");
		const hempenYarnRecipe = {
			...mapleLongbowRecipe.ingredients[2],
			amount: 2
		}
		expect(result).toMatchObject(hempenYarnRecipe);
	});

	it("Oak Lumber",() => {
		const result = validParser.getRecipeByItemIdentifier("Oak Lumber");
		expect(result).toMatchObject(oakLumberRecipe);
	});
	
	it("Cotton Yarn",() => {
		const result = validParser.getRecipeByItemIdentifier("Cotton Yarn");
		expect(result).toMatchObject(cottonYarnRecipe);
	});

	it("Growth Formula Gamma",() => {
		const result = validParser.getRecipeByItemIdentifier("Growth Formula Gamma");
		expect(result).toMatchObject(growthFormulaGammaRecipe);
	});
});

suite('Large Recipes', () => { 
	it("Maple Longbow",() => {
		const result = validParser.getRecipeByItemIdentifier("Maple Longbow");
		expect(result).toMatchObject(mapleLongbowRecipe);
	});
	
	it("Pastoral Oak Cane",() => {
		const result = validParser.getRecipeByItemIdentifier("Pastoral Oak Cane");
		expect(result).toMatchObject(pastoralOakCaneRecipe);
	});
})

suite("AI Generated Tests", () => {
	it("Test valid item name retrieval", () => {
		const itemName = validParser.getItemNameFromId(5062);
		expect(itemName).toBe("Copper Ingot");
	});

	it("Test valid recipe retrieval by item name", () => {
		const recipe = validParser.getRecipeByItemIdentifier("Copper Ingot");
		expect(recipe).toMatchObject(copperRecipe);
	});

	it("Test valid recipe retrieval by item id", () => {
		const recipe = validParser.getRecipeByItemIdentifier(5062);
		expect(recipe).toMatchObject(copperRecipe);
	});

	it("Test valid gathering name retrieval", () => {
		const gatheringName = validParser.getGatheringNameById(1);
		expect(gatheringName).not.toBe(null);
	});

	it("Test valid icon path retrieval", () => {
		const iconPath = validParser.getIconPathOfItemId(5062);
		expect(iconPath).not.toBe(null);
	});

	it("Test isCraftable method with valid id", () => {
		const isCraftable = validParser.isCraftable(5062);
		expect(isCraftable).toBe(true);
	});

	it("Test isCraftable method with invalid id", () => {
		const isCraftable = validParser.isCraftable(-1);
		expect(isCraftable).toBe(false);
	});
});

afterAll(async () => {
	await validParser.close();
});