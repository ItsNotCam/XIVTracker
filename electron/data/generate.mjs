import * as fs from 'fs/promises';

import {
	resolve as pathResolve,
} from 'path';
import RecipeProvider from './generateRecipes.mjs';

const first = 0;
const last = 45700;

var generateItems = async(basePath) => { throw("Not implemented") };
var generateRecipes = async(basePath) => { throw("Not implemented") };
var generateGatheringItems = async(basePath) => { throw("Not implemented") };
var generateMapEntries = async(basePath) => { throw("Not implemented") };
var generateMonsters = async(basePath) => { throw("Not implemented") };
var generateNodes = async(basePath) => { throw("Not implemented") };

async function generate(basePath) {
	const generatedTypes = ["items", "recipes", "icons", "gathering-items", "map-entries", "monsters", "nodes"];

	return new Promise(async(resolve, _) => {
		await Promise.all(generatedTypes.map(async (dataType) => {
			let data = null;
			let outFilename = null;
			switch (dataType) {
				case "items": 
					outFilename = "xiv_item-id-by-name.json";
					data = await generateItems(basePath); 
					break;

				case "nodes": 
					outFilename = "xiv_nodes-by-item-id.json";
					data = await generateNodes(basePath); 
					break;

				case "recipes": 
					outFilename = "xiv_recipe-by-id.json";
					data = await generateRecipes(basePath); 
					break;

				case "monsters": 
					outFilename = "xiv_monsters-by-id.json";
					data = await generateMonsters(basePath); 
					break;

				case "map-entries": 
					outFilename = "xiv_map-entries-by-id.json";
					data = await generateMapEntries(basePath); 
					break;

				case "gathering-items": 
					outFilename = "xiv_gathering-items-by-id.json";
					data = await generateGatheringItems(basePath); 
					break;

				default:
					console.error("Invalid type specified.");
			}

			if(outFilename && data) {
				console.log(`[Update TC Data] Writing ${outFilename}`);
				await fs.writeFile(pathResolve(basePath, outFilename), JSON.stringify(data, null, 2));
				console.log(`[Update TC Data] Wrote and saved ${outFilename}`);
			}
		}));
		resolve();
	});
}

generateItems = async(basePath) => {
	console.log("[Update TC Data] Generating items...");
	const itemsData = JSON.parse(await fs.readFile(
		pathResolve(basePath, `items.json`), 'utf8')
	);
	let outData = {};
	for (let rowId = first; rowId < last; rowId++) {
		const item = itemsData[String(rowId)];
		if (!item) continue;

		const itemName = item["en"];
		outData[itemName] = rowId;
	}
	console.log("[Update TC Data] Items generated.");
	return outData;
}

generateRecipes = async(basePath) => {
	const ok = new RecipeProvider(basePath);
	await ok.init();
	ok.generateRecipes();
}

generateGatheringItems = async(basePath) => {
	console.log("[Update TC Data] Generating gathering items...");
	const gatheringData = JSON.parse(await fs.readFile(
		pathResolve(basePath, `gathering-items.json`), 'utf8')
	);
	
	let outData = {};
	for (let i = 1; i < 10908; i++) {
		if (!gatheringData[String(i)]) continue;

		const result = gatheringData[String(i)];
		if (!result) continue;

		outData[result["itemId"]] = result;
	}
	console.log("[Update TC Data] Gathering items generated.");
	return outData;
}

generateMapEntries = async(basePath) => {
	console.log("[Update TC Data] Generating map entries...");
	const mapEntriesData = JSON.parse(await fs.readFile(
		pathResolve(basePath, `map-entries.json`), 'utf8')
	);

	let outData = {};
	mapEntriesData.forEach(entry => {
		outData[entry["id"]] = entry;
	});
	console.log("[Update TC Data] Map entries generated.");
	return outData;
}

generateMonsters = async(basePath) => {
	console.log("[Update TC Data] Generating monsters...");
	const monstersData = JSON.parse(await fs.readFile(
		pathResolve(basePath, `monsters.json`), 'utf8')
	);

	let outData = {};
	Object.entries(monstersData).forEach(([key, value]) => {
		let newItem = { ...value, rowid: key };
		outData[value["baseid"]] = newItem;
	});
	console.log("[Update TC Data] Monsters generated.");
	return outData;
}

generateNodes = async(basePath) => {
	console.log("[Update TC Data] Generating nodes...");
	const nodesData = JSON.parse(await fs.readFile(
		pathResolve(basePath, `nodes.json`), 'utf8')
	);

	let outData = {};
	const removeItemList = (data) => {
		const newData = { ...data };
		delete newData["items"];
		return newData;
	};
	Object.entries(nodesData).forEach(([key, value]) => {
		const items = value["items"];
		items.forEach(item => {
			const itemStr = String(item);
			if (!outData[itemStr]) {
				outData[itemStr] = [removeItemList(value)];
			} else {
				outData[itemStr].push(removeItemList(value));
			}
		});
	});

	console.log("[Update TC Data] Nodes generated.");
	return Object.fromEntries(Object.entries(outData).sort((a, b) => parseInt(a[0]) - parseInt(b[0])));
}

export default generate;