import * as fs from 'fs/promises';
import process from 'process';
import path from 'path';

const first = 0;
const last = 45700;

let generateItems = async(basePath, filename) => { throw("Not implemented") };
let generateRecipes = async(basePath, filename) => { throw("Not implemented") };
let generateGatheringItems = async(basePath, filename) => { throw("Not implemented") };
let generateMapEntries = async(basePath, filename) => { throw("Not implemented") };
let generateMonsters = async(basePath, filename) => { throw("Not implemented") };
let generateNodes = async(basePath, filename) => { throw("Not implemented") };

async function generate(basePath) {
	const generatedTypes = ["items", "recipes", "icons", "gathering-items", "map-entries", "monsters", "nodes"];

	return new Promise((resolve, _) => {
		generatedTypes.forEach(async (dataType) => {
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

				// case "icons": 
				// 	throw("Not implemented yet"); 

				default:
					console.error("Invalid type specified.");
			}

			if(outFilename && data) {
				console.log(`[Update TC Data] Writing ${outFilename}`);
				await fs.writeFile(path.resolve(basePath, outFilename), JSON.stringify(data, null, 2));
				console.log(`[Update TC Data] Wrote and saved ${outFilename}`);
			}
		});
		resolve();
	});
}

generateItems = async(basePath, filename) => {
	console.log("[Update TC Data] Generating items...");
	const itemsData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `items.json`), 'utf8')
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

generateRecipes = async(basePath, filename) => {
	console.log("[Update TC Data] Generating recipes...");
	const recipesData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `recipes.json`), 'utf8')
	);

	let outData = {};
	recipesData.forEach(entry => {
		const result = entry["result"];
		outData[result] = entry;
	});
	console.log("[Update TC Data] Recipes generated.");
	return outData;
}

generateGatheringItems = async(basePath, filename) => {
	console.log("[Update TC Data] Generating gathering items...");
	const gatheringData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `gathering-items.json`), 'utf8')
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

generateMapEntries = async(basePath, filename) => {
	console.log("[Update TC Data] Generating map entries...");
	const mapEntriesData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `map-entries.json`), 'utf8')
	);

	let outData = {};
	mapEntriesData.forEach(entry => {
		outData[entry["id"]] = entry;
	});
	console.log("[Update TC Data] Map entries generated.");
	return outData;
}

generateMonsters = async(basePath, filename) => {
	console.log("[Update TC Data] Generating monsters...");
	const monstersData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `monsters.json`), 'utf8')
	);

	let outData = {};
	Object.entries(monstersData).forEach(([key, value]) => {
		let newItem = { ...value, rowid: key };
		outData[value["baseid"]] = newItem;
	});
	console.log("[Update TC Data] Monsters generated.");
	return outData;
}

generateNodes = async(basePath, filename) => {
	console.log("[Update TC Data] Generating nodes...");
	const nodesData = JSON.parse(await fs.readFile(
		path.resolve(basePath, `nodes.json`), 'utf8')
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