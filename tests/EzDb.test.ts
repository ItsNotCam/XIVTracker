import { afterAll, assert, beforeAll, describe, it, suite } from "vitest";
import EzDb from "../electron/libs/db/EzDb";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import { afterEach } from "vitest";

const TEST_DB_PATH = path.resolve("testdb.db");

const fileExists = async(path: string): Promise<boolean> => {
	try {
		const stat = await fs.stat(path);
		return stat.isFile();
	} catch {
		return false;
	}
}

afterEach(() => {
	try {
		fsSync.unlinkSync(TEST_DB_PATH);
	} catch(e) {
		if(e.code !== "ENOENT"){
			console.error("error originated from aftereach", e);
		}
	}
})

suite('Creating databases', () => {
	it("Should fail to create a new database with empty path", async () => {
		await EzDb.createNew("").catch((e) => {
			assert(e instanceof Error && e.message.match(/Invalid file extension/));
		});
	});
	
	it("Should fail to create a new database with directory path", async () => {
		await EzDb.createNew("haha/").catch((e) => {
			assert(e instanceof Error && e.message.match(/Invalid file extension/));
		});
	});

	it("Should fail to create a new database with invalid extension 'testdb.dbd'", async () => {
		await EzDb.createNew("testdb.dbd").catch((e) => {
			assert(e instanceof Error && e.message.match(/Invalid file extension/));
		});
	});

	it(`Should create a new database '${TEST_DB_PATH}'`, async () => {
		const fp = path.resolve(process.cwd(), TEST_DB_PATH);

		await EzDb.createNew(TEST_DB_PATH, true);
		assert(await fileExists(fp));
	});
	
	it("Should not be able to create the same database twice", async () => {
		const fp = path.resolve(TEST_DB_PATH);

		await EzDb.createNew(TEST_DB_PATH);
		assert(await fileExists(fp));

		await EzDb.createNew(TEST_DB_PATH, false).catch((e) => {
			assert(e.message === "DB exists");
		});
	});
	
	it("Should delete old database when forced", async () => {
		const fp = path.resolve(TEST_DB_PATH);

		await EzDb.createNew(TEST_DB_PATH);
		assert(await fileExists(fp));
		
		await EzDb.createNew(TEST_DB_PATH, true);
		assert(await fileExists(fp));
	});
	
	it("Should fail to delete old file if in use", async () => {
		const fp = path.resolve(TEST_DB_PATH);

		let db = await EzDb.createNew(TEST_DB_PATH);
		assert(db instanceof EzDb && !db.isConnected() && (await fileExists(fp)));
		
		db.connect();

		await EzDb.createNew(TEST_DB_PATH, true).catch((e) => {
			assert(e !== null && e instanceof Error && (e.message.match(/EPERM/) || e.message.match(/EBUSY/)));
		});
		
		db.close();
	});
})

suite('Connecting to databases', () => {

	afterEach(() => {
		try {
			fsSync.unlinkSync(TEST_DB_PATH);
		} catch(e) {
			if(e.code !== "ENOENT"){
				console.error(e);
			}
		}
	})
	

	it("Should fail to connect to a non-existing database", async () => {
		await new EzDb("non-existing.db").connect().catch((e) => {
			assert(e instanceof Error && e.message.match(/DB file does not exist/));
		});
	});

	it("Should connect to an existing database", async () => {
		const db = await EzDb.createNew(TEST_DB_PATH).then(e => e.connect());
		assert(db.isConnected());
		db.close();
	});

	it("Shouldnt connect twice", async () => {
		const db = await EzDb.createNew(TEST_DB_PATH).then(e => e.connect());
		assert(db.isConnected());
		db.connect().catch((e) => {
			assert(e instanceof Error && e.message.match(/DB already connected/));
		});
		await db.close();
		assert(!db.isConnected());
	});

	it("Should disconnect from the database", async () => {
		const db = await EzDb.createNew(TEST_DB_PATH);
		await db.connect();
		assert(db.isConnected());
		await db.close();
		assert(!db.isConnected());
	});

	it("Should reconnect to the database", async () => {
		const db = await EzDb.createNew(TEST_DB_PATH);

		await db.connect();
		assert(db.isConnected());
		
		await db.close();
		assert(!db.isConnected());

		await db.reconnect();
		assert(db.isConnected());

		await db.close();
		assert(!db.isConnected());
	});
});