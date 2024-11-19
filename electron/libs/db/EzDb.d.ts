import { TCRecipe } from "../providers/RecipeProviderTypes";

export interface SearchItem {
	name: string,
	date: Date
}

export default interface DBSchema {
	RecentRecipeSearches: SearchItem[],
	Recipes: Map<string,TCRecipe>
}