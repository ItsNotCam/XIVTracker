interface DBSearchItem {
	name: string,
	date: Date
}

interface DBSchema {
	RecentRecipeSearches: DBSearchItem[],
	Recipes: Map<string,TCRecipe>
}