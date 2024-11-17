import path from "path";
import sqlite3 from "sqlite3";

import * as fs from "fs/promises"
import { EzDBNotConnectedError } from "./EzDbTypes.d";

import { fileURLToPath } from 'url';

// Enable verbose mode for additional logging
sqlite3.verbose();

export default class EzDb {
	public readonly DB_PATH;
	private static readonly INIT_DB_SCRIPT_PATH = `${process.cwd()}/electron/data/db/InitDB.sqlite`;
	public static readonly DEFAULT_DB_PATH = path.resolve(`${process.cwd()}/electron/data/db/xiv-db.db`);

	private connection: sqlite3.Database | null = null;

	constructor(p?: string) {
		this.DB_PATH = p || EzDb.DEFAULT_DB_PATH;
	}	

	public isConnected(): boolean {
		return this.connection !== null;
	}

	public async reconnect(): Promise<EzDb> {
		this.close();
		return await this.connect();
	}

	private static async dbFileExists(p: string): Promise<boolean> {
		try {
			const stats = await fs.stat(p);
			return stats.isFile() && path.extname(p) === ".db";
		} catch {
			return false;
		}
	}

	public static async createNew(dbPath: string = EzDb.DEFAULT_DB_PATH, force: boolean = false): Promise<EzDb> {
		if(path.extname(dbPath) !== ".db") {
			throw(new Error("Invalid file extension, must be .db"));
		}

		// if the db exists and we're not forcing a new one, throw an error
		const exists = await EzDb.dbFileExists(dbPath);
		if(exists && !force) {
			throw(new Error("DB exists"));
		}

		// Delete the existing one
		if(exists) {
			try {
				await fs.unlink(dbPath);
			} catch (e: any) {
				throw(new Error("Failed to delete existing DB file: " + e.message));
			}
		}

		// Create a new one
		try {
			// this is mad ugly, but it's the only way I can think of to check if the db is valid
			const newDb = await new Promise<sqlite3.Database>((resolve, reject) => {
				// try to create a new database, resolve the promise if it's successful else reject
				const db = new sqlite3.Database(dbPath, (err: Error | null) => {
					if(err) { 
						reject(err); 
					} else { 
						resolve(db); 
					}
				});
			});

			await new Promise((resolve, reject) => {
				newDb.close((err: Error | null) => {
					if(err) { 
						reject(new Error("Failed to close the temporary database" + err.message)); 
					} else {
						resolve(dbPath);
					}
				});
			});
		} catch(e: any) {
			throw(new Error("Failed to create the new database: " + e.message));
		}

		// return a new EzDb instance
		return await new EzDb(dbPath);
	}
	
	public async connect(): Promise<EzDb> {
		if(this.connection) {
			throw(new Error("DB already connected"));
		}

		if(!await EzDb.dbFileExists(this.DB_PATH)) {
			throw(new Error("DB file does not exist"));
		}

		return new Promise((resolve, reject) => {
			this.connection = new sqlite3.Database(this.DB_PATH, (err: Error | null) => {
				if(err) {
					reject(err);
				} else {
					resolve(this);
				}
			});
		})
	}

	public async getOne(sql: string): Promise<any> {
		if(!this.connection) {
			throw(new EzDBNotConnectedError());
		}

		if(!sql.match(/^SELECT/i) && !sql.match(/^PRAGMA/i)) {
			throw(new Error("Only SELECT queries are allowed"));
		}

		return new Promise((resolve, reject) => {
			this.connection!.get(sql, (err, row) => {
				if(err) {
					reject(new Error("Failed to execute query: " + err.message));
				}

				resolve(row);
			});
		});
	};

	public async getAll(sql: string): Promise<any[]> {
		if(!this.connection) {
			throw(new EzDBNotConnectedError());
		}

		if(!sql.match(/^SELECT/i) && !sql.match(/^PRAGMA/i)) {
			throw(new Error("Only SELECT queries are allowed"));
		}


		let result: any[] = await new Promise((resolve,reject) => {
			let results: any[] = []
			this.connection!.each(sql, (err, row) => {
				if(err) {
					reject(new Error("Failed to execute query: " + err.message));
				}
				results.push(row);
			}, ((err: Error | null) => {
				if(err) {
					reject(new Error("Failed to execute query: " + err.message));
				}
				resolve(results)
			}));
		});

		return result;
	}


	public async exec(sql: string): Promise<void> {
		if(!this.connection) {
			throw(new EzDBNotConnectedError());
		}

		this.connection = await new Promise((resolve, reject) => {	
			const c = this.connection!.exec(sql, function(err: Error | null) {
				if(err) {
					reject(err);
				} else {
					resolve(c);
				}
			});
		});
	}

	public async init(): Promise<EzDb> {
		if(!await EzDb.dbFileExists(this.DB_PATH)) {
			await EzDb.createNew(this.DB_PATH);
		}

		let initScript: string | undefined;
		try {
			initScript = await fs.readFile(EzDb.INIT_DB_SCRIPT_PATH, "utf-8");
		} catch(e: any) {
			throw(new Error("Failed to read file: " + e.message));	
		}

		try {
			await this.exec(initScript);
		} catch(e: any) {
			throw(new Error("Failed to execute initialization script: " + e.message))
		}

		return this;
	}

	public async close(): Promise<boolean> {
		if(!this.connection) {
			console.error("DB is not connected");
			return false;
		}

		let closed = false;
		try {
			await new Promise<boolean>((resolve, reject) => {
				this.connection!.close((err) => {
					if(err) {
						reject(err);
					} else {
						closed = true;
						resolve(true)
					}
				});
			})
		} catch(e: any) {
			console.error("Failed to close db:", e.message);
		}

		if(closed) {
			this.connection = null;
		}

		return closed;
	}

	public async wipeFile(): Promise<void> {
		if(this.connection) {
			this.close();
		}

		// if the db exists and we're not forcing a new one, throw an error
		try {
			await fs.unlink(this.DB_PATH);
		} catch (e: any) {
			if(e.code !== "ENOENT") {
				throw(new Error("Failed to delete existing DB file: " + e.message));
			}
		}
	}
}