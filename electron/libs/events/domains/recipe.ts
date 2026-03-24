import EzDb from '@backend-lib/db/EzDb'
import RecipeProvider from '@backend-lib/db/RecipeProvider';
import { DBSearchItem, IPCEvent, TCRecipe } from '@xiv-types';

let _parser: RecipeProvider | null = null;

const parser = () => {
	if(_parser) return _parser;
	_parser = new RecipeProvider().initSync();
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

const handleAskRecentRecipeSearches = async (db: EzDb): Promise<unknown> => {
	const recentSearches = db.getRecentSearches();

	const r = await Promise.all(recentSearches.map(async (search: DBSearchItem) => {
		return db.tryGetRecipe(search.name).catch(console.error).then((recipe) => ({
			name: search.name,
			date: search.date,
			recipe: recipe
		}))
	}));

	return r;
}

export const recipeHandlers = (db: EzDb): Partial<Record<IPCEvent, (event: Electron.Event, ...args: unknown[]) => void>>  => {
	return {
			"ipc:recipe.get": (_,name) => handleAskForRecipe(db, name as string),
			"ipc:recipe.getRecentSearches": () => handleAskRecentRecipeSearches(db),
			"ipc:recipe.getFavorites": () => db.getFavoriteRecipes(),
			"ipc:recipe.isFavorite": (_, name) => db.isFavoriteRecipe(name as string),
			"ipc:recipe.toggleFavorite": (_, name) => db.toggleFavoriteRecipe(name as string),
	}
}