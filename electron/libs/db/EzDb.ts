import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import DBSchema, { SearchItem } from './EzDb.d'
import { TCRecipe } from '@electron-lib/providers/RecipeProviderTypes';


export default class EzDb {
	public static readonly DEFAULT_DB_PATH = path.resolve(path.join(`electron/data/db/db.db`));

	private static readonly DB_NOT_CONNECTED = new Error("DB not connected");
	private maxRecentSearchCount: number;
	private db: Low<DBSchema> | null = null;
	private readonly dbPath: string;
	private autocommit: boolean;

	constructor(
		dbPath: string = EzDb.DEFAULT_DB_PATH, 
		maxRecentSearchCount: number = 10, 
		autocommit: boolean = true
	) {
		this.dbPath = dbPath;
		this.maxRecentSearchCount = maxRecentSearchCount;
		this.autocommit = autocommit;
	}

	public async init(): Promise<EzDb> {
		if(this.db !== null) {
			throw new Error("DB already connected");
		}

		const adapter = new JSONFile<DBSchema>(this.dbPath);
		this.db = new Low<DBSchema>(adapter, {} as DBSchema);

		await this.db.read();
		this.db.data ||= { 
			RecentRecipeSearches: [], 
			Recipes: new Map<string, TCRecipe>() 
		};
		await this.db.write();

		return this;
	}

	public setMaxRecentSearchCount(count: number) {
		this.maxRecentSearchCount = count;

		if(this.db !== null && this.db.data.RecentRecipeSearches !== undefined) {
			while(this.db.data.RecentRecipeSearches.length > this.maxRecentSearchCount) {
				this.removeOldestRecentSearch();
			}
			this.db.write();
		}
	}

	public isConnected = (): boolean => this.db !== null;

	public async close(): Promise<void> {
		await this.db?.write();
		this.db = null;
	}

	public setAutoCommit(autocommit: boolean) {
		this.autocommit = autocommit;
	}

	public async commit() {
		await this.db?.write();
	}

	public async addRecentSearch(newSearch: string, date?: Date): Promise<void> {
		if(this.db == null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		let RecentSearches = this.db.data.RecentRecipeSearches || [];
		if(RecentSearches.length > 0) {
			RecentSearches = RecentSearches.filter(search => search.name !== newSearch);
		}

		if(RecentSearches.length >= this.maxRecentSearchCount) {
			RecentSearches.pop();
		}

		RecentSearches.unshift({
			name: newSearch,
			date: date || new Date()
		});

		this.db.data.RecentRecipeSearches = RecentSearches;

		if(this.autocommit) {
			await this.db.write();
		}
	}

	public getRecentSearches(limit?: number): SearchItem[] {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const RecentSearches = this.db.data.RecentRecipeSearches || [];
		return limit ? RecentSearches.slice(0,limit) : RecentSearches;
	}

	public byName(): SearchItem[] {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches: RecentSearches } = this.db.data;
		return RecentSearches.sort((a, b) => a.name.localeCompare(b.name));
	}

	public byDate(): SearchItem[] {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches: RecentSearches } = this.db.data;
		return RecentSearches.sort((a, b) => {
			if(a > b) return 1;
			if(a < b) return -1;
			return 0;
		});
	}

	public async removeRecentSearch(searchToRemove: string): Promise<void> {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches: RecentSearches } = this.db.data;
		this.db.data.RecentRecipeSearches = RecentSearches
			.filter(search => search.name !== searchToRemove);

		if(this.autocommit) {
			await this.db.write();
		}
	}

	public async removeOldestRecentSearch(): Promise<void> {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		this.db.data.RecentRecipeSearches.pop();

		if(this.autocommit) {
			await this.db.write();
		}
	}

	public async addRecipe(newRecipe: TCRecipe): Promise<void> {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { Recipes } = this.db.data;
		if(Recipes.has(newRecipe.name)) {
			return;
		}

		Recipes.set(newRecipe.name, newRecipe);
		
		if(this.autocommit) {
			await this.db.write;
		}
	}
}