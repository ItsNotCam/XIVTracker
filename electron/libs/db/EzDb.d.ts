import { TCRecipe } from "../providers/RecipeProviderTypes";

export interface DBSearchItem {
	name: string,
	date: Date
}

export default interface DBSchema {
	RecentRecipeSearches: DBSearchItem[],
	Recipes: Map<string,TCRecipe>
}