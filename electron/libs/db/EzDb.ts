import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';

export default class EzDb implements IDisposable {
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

	public init = async(): Promise<EzDb> => {
		if(this.db !== null) {
			throw new Error("DB already connected");
		}

		const adapter = new JSONFile<DBSchema>(this.dbPath);
		this.db = new Low<DBSchema>(adapter, {
			RecentRecipeSearches: [],
			Recipes: {},
			FavoriteRecipes: []
		});

		await this.db.read();
		await this.db.write();

		return this;
	}

	public setMaxRecentSearchCount = (count: number) => {
		this.maxRecentSearchCount = count;

		if(this.db !== null && this.db.data.RecentRecipeSearches !== undefined) {
			while(this.db.data.RecentRecipeSearches.length > this.maxRecentSearchCount) {
				this.removeOldestRecentSearch();
			}
			this.db.write();
		}
	}

	public isConnected = (): boolean => this.db !== null;


	public isFavoriteRecipe = (recipeName: string): boolean => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { FavoriteRecipes } = this.db.data;
		if(FavoriteRecipes === undefined) {
			return false;
		}

		return FavoriteRecipes.find((r: string) => r === recipeName) !== undefined;
	}

	public getFavoriteRecipes = (): string[] => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { FavoriteRecipes } = this.db.data;
		return FavoriteRecipes || [];
	}

	public addFavoriteRecipe = (recipeName: string) => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		let { FavoriteRecipes } = this.db.data;
		if(FavoriteRecipes === undefined) {
			FavoriteRecipes = [recipeName];
		} else if(this.tryGetRecipe(recipeName) !== undefined) {
			FavoriteRecipes.push(recipeName);
		}

		this.db.data.FavoriteRecipes = FavoriteRecipes;

		if(this.autocommit) {
			this.db.write();
		}
	}

	public toggleFavoriteRecipe = (recipeName: string): boolean => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		let isFavorite: boolean = false;

		const { FavoriteRecipes } = this.db.data;
		if(FavoriteRecipes === undefined) {
			this.db.data.FavoriteRecipes = [recipeName];
			isFavorite = true;
		} else {
			const existing = FavoriteRecipes.find((r: string) => r === recipeName);
			if(existing !== undefined) {
				isFavorite = false;
				this.removeFavoriteRecipe(recipeName);
			} else {
				isFavorite = true;
				this.addFavoriteRecipe(recipeName);
			}
		}

		if(this.autocommit) {
			this.db.write();
		}

		return isFavorite;
	}

	public removeFavoriteRecipe = (recipe: string) => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { FavoriteRecipes } = this.db.data;
		if(FavoriteRecipes !== undefined && this.tryGetRecipe(recipe) !== undefined) {
			this.db.data.FavoriteRecipes = FavoriteRecipes.filter((r: string) => r !== recipe);
		}

		if(this.autocommit) {
			this.db.write();
		}
	}

	public tryGetFavorite = (recipeName: string): string | undefined => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { FavoriteRecipes } = this.db.data;
		if(FavoriteRecipes === undefined) {
			return undefined;
		}

		return FavoriteRecipes.find((r: string) => r === recipeName);
	}

	public setAutoCommit(autocommit: boolean) {
		this.autocommit = autocommit;
	}

	public tryGetRecipe = async(recipeName: string): Promise<TCRecipe | undefined> => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { Recipes } = this.db.data;
		if(Recipes === undefined || Recipes[recipeName] === undefined) {
			return undefined;
		}

		return Recipes[recipeName];
	}

	public async commit() {
		await this.db?.write();
	}

	public addRecentSearch = async(newSearch: string, date?: Date): Promise<void> => {
		if(this.db == null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		let RecentSearches = this.db.data.RecentRecipeSearches || [];
		if(RecentSearches.length > 0) {
			RecentSearches = RecentSearches.filter((search: DBSearchItem) => search.name !== newSearch);
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

	public getRecentSearches = (limit?: number): DBSearchItem[] => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const RecentSearches = this.db.data.RecentRecipeSearches || [];
		return limit ? RecentSearches.slice(0,limit) : RecentSearches;
	}

	public byName = (): DBSearchItem[] => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches: RecentSearches } = this.db.data;
		return RecentSearches.sort((a: DBSearchItem, b: DBSearchItem) => a.name.localeCompare(b.name));
	}

	public byDate = (): DBSearchItem[] => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches: RecentSearches } = this.db.data;
		return RecentSearches.sort((a: DBSearchItem, b: DBSearchItem) => {
			if(a > b) return 1;
			if(a < b) return -1;
			return 0;
		});
	}

	public removeRecentSearch = async(searchToRemove: string): Promise<void> => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		const { RecentRecipeSearches } = this.db.data;
		this.db.data.RecentRecipeSearches = RecentRecipeSearches
			.filter((search: DBSearchItem) => search.name !== searchToRemove);

		if(this.autocommit) {
			await this.db.write();
		}
	}

	public removeOldestRecentSearch = async(): Promise<void> =>  {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		this.db.data.RecentRecipeSearches.pop();

		if(this.autocommit) {
			await this.db.write();
		}
	}

	public addRecipe = async (newRecipe: TCRecipe): Promise<void> => {
		if(this.db === null) {
			throw EzDb.DB_NOT_CONNECTED;
		}

		await this.db.read();

		// let Recipes = this.db.data.Recipes || { };
		// Recipes[newRecipe.name] = newRecipe;

		this.db.data.Recipes = {
			...this.db.data.Recipes,
			[newRecipe.name]: newRecipe
		};

		if(this.autocommit) {
			await this.db.write();
		}
	}
	
	public dispose = async(): Promise<void> => {
		await this.db?.write();
		this.db = null;
	}
}