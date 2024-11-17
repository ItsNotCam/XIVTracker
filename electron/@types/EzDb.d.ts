import { TCRecipe } from "@electron/@types/TCParser";

export interface RecentSearch {
	name: string,
	date: Date
}

export default interface DBSchema {
	RecentSearches: RecentSearch[],
	Recipes: Map<string,TCRecipe>
}