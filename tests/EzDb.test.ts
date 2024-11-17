import EzDb from "@electron-lib/db/EzDb";
import Types from "@xiv-types/Types";
import { afterAll, afterEach, beforeEach, assert, beforeAll, expect, it, suite } from "vitest";

import * as fs from 'fs/promises';
import { fail } from "assert";

let db: EzDb;
const DB_PATH: string = "temp.db";

afterAll(async() => {
	if(db) {
		await db.close();
	}
	try {
		await fs.unlink(DB_PATH);
	} catch(e: any) {
		console.error("Failed to delete the database file at", DB_PATH, ":", e.message);
	}
})

suite("Initialize", async() => {
	beforeEach(() => {
		db = new EzDb(DB_PATH);
	});

	afterEach(async() => {
		await db.close();
		await fs.unlink(DB_PATH);
	});

	it("Should initialize the database", async() => {
		await db.init(), 

		expect(
			db.isConnected(), 
			"DB not connected"
		).toBe(true);

		await db.close();
	});

	it("Should close the database", async() => {
		await db.init();
		expect(
			db.isConnected(),
			"DB Failed to initialize"
		).toBe(true);

		await db.close();
		expect(
			db.isConnected(),
			"DB failed to close the database"
		).toBe(false);
		await db.close();
	});
});

suite("Insert", async() => {
	beforeEach(async() => {
		await db.init();
	});	
	
	afterEach(async() => {
		await db.close();
		await fs.unlink(DB_PATH);
	});

	it("Should get no recent searches", async() => {
		expect(db.getRecentSearches().length).toBe(0);
	});

	it("Should insert a new recent search", async() => {
		await db.addRecentSearch("haha");
		expect(
			db.getRecentSearches(1)[0]
		).toMatchObject({
			name: "haha"
		});
	});
	
	it("Should not insert the same search twice", async() => {
		await db.addRecentSearch("haha");
		await db.addRecentSearch("haha");
		expect(
			db.getRecentSearches().length
		).toBe(1);
	});
	
	it("Should not be able to insert more than the limit", async() => {
		try {

			let tempDB = await new EzDb("supertemp.db", 1).init();
	
			for(let i = 1; i <= 5; i++) {
				await tempDB.addRecentSearch(i.toString());
			}
	
			expect(tempDB.getRecentSearches().length).toBe(1);
		} finally {
			fs.unlink("supertemp.db");
		}
	});
});

suite("Update", async() => {
	beforeEach(async() => {
		await db.init();
	});	
	
	afterEach(async() => {
		await db.close();
		await fs.unlink(DB_PATH);
	});

	it("Should update a search with the same name to the current time", async() => {
		await db.addRecentSearch("same date");
		await db.addRecentSearch("inserted in between");
		expect(db.getRecentSearches()).toMatchObject([
			{ name: "inserted in between" },
			{ name: "same date" },
		])
		await db.addRecentSearch("same date");
		expect(db.getRecentSearches()).toMatchObject([
			{ name: "same date" },
			{ name: "inserted in between" }
		])
	});
});


suite("Delete", async() => {
	beforeEach(async() => {
		await db.init();
	});	
	
	afterEach(async() => {
		await db.close();
		await fs.unlink(DB_PATH);
	});

	it("Should remove items from the database", async() => {
		for(let i = 1; i <= 5; i++) {
			await db.addRecentSearch(i.toString());
		}

		expect(db.getRecentSearches().length).toBe(5);

		for(let i = 1; i <= 5; i++) {
			await db.removeOldestRecentSearch();
		}

		expect(db.getRecentSearches().length).toBe(0);
	});
});
