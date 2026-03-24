import EzDb from '@backend-lib/db/EzDb'
import RecipeProvider from '@backend-lib/db/RecipeProvider';
import { IPCEvent } from '../types';

let _parser: RecipeProvider | null = null;

const parser = () => {
	if(_parser) return _parser;
	_parser = new RecipeProvider();
	return _parser;
}

const handleAskForRecipe = async (db: EzDb, itemName: string): Promise<TCRecipe | null> => {
	const recipeProvider = parser();

	const existingRecipe: TCRecipe | undefined = await db.tryGetRecipe(itemName);
	if (existingRecipe) {
		db.addRecentSearch(itemName);
	}

	const recipe = recipeProvider.getRecipeByItemIdentifier(itemName);
	if (recipe) {
		await db.addRecentSearch(itemName);
		await db.addRecipe(recipe);
	}

	return recipe;
}

const handleAskRecentRecipeSearches = async (db: EzDb): Promise<any> => {
	const recentSearches = db.getRecentSearches();

	const r = await new Promise(async (resolve, _) => {
		const result = await Promise.all(recentSearches.map(async (search: DBSearchItem) => {
			const recipe = await db.tryGetRecipe(search.name).catch(console.error);
			return {
				name: search.name,
				date: search.date,
				recipe: recipe
			}
		}));
		resolve(result);
	});

	return r;
}

export const recipeHandlers = (db: EzDb): Partial<Record<IPCEvent, (event: Electron.Event, ...args: any[]) => void>>  => {
	return {
			"ipc:recipe.get": (_,name) => handleAskForRecipe(db, name),
			"ipc:recipe.getRecentSearches": (_) => handleAskRecentRecipeSearches(db),
			"ipc:recipe.getFavorites": (_) => db.getFavoriteRecipes(),
			"ipc:recipe.isFavorite": (_, name: string) => db.isFavoriteRecipe(name),
			"ipc:recipe.toggleFavorite": (_, name: string) => db.toggleFavoriteRecipe(name),
	}
}