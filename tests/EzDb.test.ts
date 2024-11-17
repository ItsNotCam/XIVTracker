import { afterAll, assert, beforeAll, describe, expect, it, suite, afterEach, beforeEach } from "vitest";
import EzDb from "../electron/libs/db/EzDb";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import { EzDBNotConnectedError } from "../electron/libs/db/EzDbTypes.d";

const TEST_DB_PATH = path.resolve("testdb.db");

const fileExists = async (path: string): Promise<boolean> => {
	try {
		const stat = await fs.stat(path);
		return stat.isFile();
	} catch {
		return false;
	}
}

suite("Database IO", async () => {
	afterEach(() => {
		try {
			fsSync.unlinkSync(TEST_DB_PATH);
		} catch (e) {
			if (e.code !== "ENOENT") {
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
			} catch (e) {
				if (e.code !== "ENOENT") {
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
})

suite('Executing SQL commands', async () => {
	let db: EzDb;

	await beforeEach(async () => {
		db = await EzDb.createNew(TEST_DB_PATH).then(c => c.connect());
	});

	await afterEach(() => {
		db.wipeFile();
	});

	it("Should fail to execute SQL commands if not connected", async () => {
		await db.close();

		await db.exec("SELECT * FROM test").catch((e) => {
			assert(e instanceof Error && e.message.match(/Database is not connected/));
		});
	});

	it("Should get no such table", async () => {
		try {
			await db.exec("SELECT * FROM test");
		} catch (e) {
			assert(e instanceof Error && e.message.match(/no such table: test/));
		} finally {
			await db.close();
		}
	});

	it("Should create table", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		const result = await db.getOne("SELECT * FROM sqlite_master WHERE type='table' AND name='test'");
		expect(result).not.toBe(undefined);
		expect(result).toMatchObject({ type: 'table', name: 'test' });
		await db.close();
	});

	it("Should insert data", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		await db.exec("INSERT INTO test (name) VALUES ('test')");
		await db.close();
	});

	it("Should get data", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		await db.exec("INSERT INTO test (name) VALUES ('test')");
		const result = await db.getOne("SELECT * FROM test");
		expect(result).not.toBe(undefined);
		await db.close();
	});

	it("Should get no data", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		const result = await db.getOne("SELECT * FROM sqlite_master WHERE type='table' AND name='test'");
		expect(result).not.toBe(undefined);
		expect(result).toMatchObject({ type: 'table', name: 'test' });

		const results = await db.getOne("SELECT * FROM test");
		expect(results).toBe(undefined);
		await db.close();
	});

	it("Should delete data", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		await db.exec("INSERT INTO test (name) VALUES ('test')");
		const result1 = await db.getOne("SELECT * FROM test");
		expect(result1).not.toBe(undefined);

		await db.exec("DELETE FROM test WHERE ID=1");
		const result2 = await db.getOne("SELECT * FROM test");
		expect(result2).toBe(undefined);

		await db.close();
	})

	it("Should get no data when not connected", async () => {
		await db.exec("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		await db.exec("INSERT INTO test (name) VALUES ('test')");
		await db.close();

		try {
			await db.getOne("SELECT * FROM test");
			expect(true).toBe(false);
		} catch(e) {
			expect(e instanceof EzDBNotConnectedError);
		} finally {
			await db.close();
		}
	});
	
	it("Should only be able to execute SELECT-type statements within the get() function", async () => {
		try {
			await db.getOne("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)");
		} catch(e) {
			expect(e instanceof Error && e.message.match(/Only SELECT queries are allowed/));
		} finally {
			db.close();
		}
	})
	
	it("getOne() Should fail gracefully when inputting invalid SQL", async () => {
		try {
			await db.getOne("SELECT * FROM  test dddddd");
		} catch(e) {
			expect(e instanceof Error && e.message.match(/Failed to execute query:/));
		} finally {
			db.close();
		}
	});
	
	it("getAll() Should fail gracefully when inputting invalid SQL", async () => {
		try {
			await db.getAll("SELECT * FROM  test dddddd");
		} catch(e) {
			expect(e instanceof Error && e.message.match(/Failed to execute query:/));
		} finally {
			db.close();
		}
	});

	it("Should run init file successfully", async () => {
		const db2 = await db.init();
		expect(db2).not.toBe(undefined);

		let result = await db.getOne("SELECT * FROM sqlite_master WHERE type='table' AND name='RECENT_SEARCHES'");
		expect(result).toMatchObject({
			type: "table",
			name: "RECENT_SEARCHES",
			tbl_name: "RECENT_SEARCHES"
		});

		result = await db.getAll("PRAGMA table_info(RECENT_SEARCHES)");
		expect(result).toStrictEqual([
			{ cid: 0, name: 'id', type: 'INTEGER', notnull: 0, dflt_value: null, pk: 1 },
			{ cid: 1, name: 'name', type: 'VARCHAR(32)', notnull: 1, dflt_value: null, pk: 0 },
			{ cid: 2, name: 'time', type: 'DATETIME', notnull: 0, dflt_value: "CURRENT_TIMESTAMP", pk: 0 },
			{ cid: 3, name: 'data', type: 'BLOB', notnull: 0, dflt_value: null, pk: 0 }
		]);
		await db.close();
	});

	it("Should get multiple rows", async () => {
		const db2 = await db.init();
		expect(db2).not.toBe(undefined);

		let result = await db.getOne("SELECT * FROM sqlite_master WHERE type='table' AND name='RECENT_SEARCHES'");
		expect(result).toMatchObject({
			type: "table",
			name: "RECENT_SEARCHES",
			tbl_name: "RECENT_SEARCHES"
		});

		await db.exec("INSERT INTO RECENT_SEARCHES (name, data) VALUES ('test', 'test')");
		await db.exec("INSERT INTO RECENT_SEARCHES (name, data) VALUES ('test1', 'test1')");
		await db.exec("INSERT INTO RECENT_SEARCHES (name, data) VALUES ('test2', 'test2')");
		await db.exec("INSERT INTO RECENT_SEARCHES (name, data) VALUES ('test3', 'test3')");

		result = await db.getAll("SELECT * FROM RECENT_SEARCHES");
		expect(result).toMatchObject([
			{ id: 1, name: 'test', data: 'test' },
			{ id: 2, name: 'test1', data: 'test1' },
			{ id: 3, name: 'test2', data: 'test2' },
			{ id: 4, name: 'test3', data: 'test3' }
		]);
		
		await db.close();
	});
});