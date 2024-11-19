import UpdateTCData, { clearAllData, metaFiles, dataFolder } from "../electron/data/updateTCData.mjs";

import { afterAll, assert, beforeAll, describe, expect, it, suite } from "vitest";

import * as fs from "fs/promises";
import { afterEach } from "node:test";
import path from "path";

const asyncSleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const validateTCFiles = async () => {
	let files = (await fs.readdir(dataFolder)).filter(f => f.endsWith(".json"));

	if (files.length !== (metaFiles.length + 6)) {
		console.log("Files length mismatch", files.length, (metaFiles.length + 6));
		return false;
	}

	for (let file of metaFiles) {
		console.log("Checking file", file);
		files = files.filter(f => f !== file);
	}

	if (files.length !== 6) {
		console.log("Files mismatch", files);
		return false;
	}

	console.log("Files are valid");
	return true;
}

beforeAll(async () => {
	await asyncSleep(1000);
	await clearAllData();
});

afterEach(async () => {
	await asyncSleep(500);
	await clearAllData();
	await asyncSleep(500);
});

describe("Serialize", async () => {
	it("Should generate fresh data", async () => {
		if(await fs.stat(dataFolder).catch(() => null)) {
			await fs.rmdir(dataFolder, { recursive: true });
		}
		await asyncSleep(1000);
		await UpdateTCData();
		await asyncSleep(1000);
		expect(await validateTCFiles()).toBe(true);
		await asyncSleep(1000);
	});

	it("Should not update", async () => {
		// create new
		await UpdateTCData();
		await asyncSleep(1000);
		expect(await validateTCFiles()).toBe(true);

		await asyncSleep(1000);

		// try to create new again
		await UpdateTCData();
		await asyncSleep(1000);
		expect(await validateTCFiles()).toBe(true);
	});

	it("Should update with old meta", async () => {
		// create new
		await UpdateTCData();

		// set meta to be old
		await asyncSleep(1000);
		await fs.writeFile(path.join(dataFolder, ".meta"), JSON.stringify({ 
			tc_last_release_date: "2021-11-12T18:24:32.000Z",
			files: metaFiles
		}));

		await asyncSleep(1000);

		// update data
		await UpdateTCData();
		await asyncSleep(1000);
		expect(await validateTCFiles()).toBe(true);
	});
});