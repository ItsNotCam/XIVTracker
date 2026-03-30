import * as fs from 'fs/promises';
import path from "path";

import Database, { type Transaction } from "better-sqlite3";
import z from "zod";

import * as x from "./transforms";
import { 
	DropSource,
	GatheringItem,
	GatheringSearchIndex,
	GatheringType,
	Item,
	ItemLevel,
	Job,
	MapEntry,
	Mob,
	Place 
} from "../types/rows";

type TableExecutionContext = {
	schema: z.ZodTypeAny,
	data: unknown,
	tableName: string,
	type: z.ZodObject<z.ZodRawShape>
}

const parentFolder = path.resolve(__dirname, "..", "..");
const dbPath = path.join(parentFolder, "db.db");


let _db: Database.Database | null = null;
const getDb = (): Database.Database => {
	if (_db !== null) return _db;
	_db = new Database(dbPath, { verbose: console.log });
	return _db;
}

export const initDB = async (): Promise<void> => {
	console.info("Connecting to database...")
	const db = getDb();

	console.info("Opening SQL file...")
	const initDbFile = await fs.readFile(
		path.join(parentFolder, 'initdb.sql'),
		"utf-8"
	);

	console.info("Executing statements");

	initDbFile
		.split(";")
		.forEach((statement) => db.exec(statement.trim()))

	console.info("Done");
}

const buildInsert = (table: string, schema: z.ZodObject<any>) => {
    const keys = Object.keys(schema.shape);
    const cols = keys.join(', ');
    const vals = keys.map(k => `@${k}`).join(', ');
    return `INSERT OR REPLACE INTO ${table} (${cols}) VALUES (${vals})`;
};

const buildTransaction = (tableName: string, schema: z.ZodObject<any>): Transaction => {
	const db = getDb();
	const keys = Object.keys(schema.shape);
	return db.transaction((items: x.DbItemLevel) => {
		const statement = db.prepare(buildInsert(tableName, schema));
		for (const item of items) {
			const row: Record<string, unknown> = {};
			for (const k of keys) row[k] = (item as Record<string, unknown>)[k] ?? null;
			statement.run(row);
		}
	});
}

const insertItems = (items: Record<string, unknown>, icons: Record<string, string>) => {
	const parsedItems = x.DbItemsSchema.parse(items);
	let data = parsedItems.map(({ id, name }) => ({
		id, name, icon: icons[id] ?? null
	}))

	const transaction = buildTransaction("item", Item);
	transaction(data);
}

export const seedDbWith = (data: Record<string, unknown>): void => {
	const {
		items,
		"item-icons": itemIcons,
		"item-level": itemLevel,
		"job-name": jobName,
		"map-entries": mapEntries,
		"drop-sources": dropSources,
		"gathering-items": gatheringItems,
		"gathering-levels": gatheringLevels,
		"gathering-search-index": gatheringSearchIndex,
		"gathering-types": gatheringTypes,
		mobs,
		monsters,
		nodes,
		places,
		recipes,
	} = data; 

	insertItems(
		items as Record<string, unknown>,
		itemIcons as Record<string, string>
	);

	const tableExecutions: TableExecutionContext[] = [
		{
			schema: x.DbJobsSchema,
			data: jobName,
			tableName: "job",
			type: Job
		},{
			schema: x.DbPlacesSchema,
			data: places,
			tableName: "place",
			type: Place
		},{
			schema: x.DbItemLevelSchema,
			data: itemLevel,
			tableName: "itemLevel",
			type: ItemLevel
		},{
			schema: x.DbPlacesSchema,
			data: places,
			tableName: "place",
			type: Place
		},{
			schema: x.DbMapEntriesSchema,
			data: mapEntries,
			tableName: "mapEntry",
			type: MapEntry
		},{
			schema: x.DbMobsSchema,
			data: mobs,
			tableName: "mob",
			type: Mob
		},{
			schema: x.DbDropSourcesSchema,
			data: dropSources,
			tableName: "dropSource",
			type: DropSource
		},{
			schema: x.DbGatheringTypesSchema,
			data: gatheringTypes,
			tableName: "gatheringType",
			type: GatheringType
		},{
			schema: x.DbGatheringItemsSchema,
			data: gatheringItems,
			tableName: "gatheringItem",
			type: GatheringItem
		},{
			schema: x.DbGatheringSearchIndexSchema,
			data: gatheringSearchIndex,
			tableName: "gatheringSearchIndex",
			type: GatheringSearchIndex
		}
	]

	for(const { schema, data, tableName, type } of tableExecutions) {
		console.log(`Seeding ${tableName}`)
		const parsed = schema.parse(data);
		buildTransaction(tableName, type)(parsed);
	}
}