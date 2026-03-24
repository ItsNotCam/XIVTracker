import { TCRecipe } from "@xiv-types";

export interface DBSearchItem {
	name: string,
	date: Date
}

export interface DBSchema {
	RecentRecipeSearches: DBSearchItem[],
	Recipes: { [key: string]: TCRecipe },
	FavoriteRecipes: string[],
}