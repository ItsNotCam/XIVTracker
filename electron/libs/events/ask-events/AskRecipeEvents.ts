import XIVTrackerApp from "../../../app";
import RecipeProvider from "../../db/RecipeProvider";
import AskEventBase from "./AskEventBase";

export default class RecipeEvents extends AskEventBase {
	private readonly app: XIVTrackerApp;
	private readonly parser: RecipeProvider;

	constructor(app: XIVTrackerApp) {
		super();
		this.app = app;
		this.parser = new RecipeProvider();
	}

	public override init() {
		super.init();
		
		this.parser.init();
		super.addHandler("ask:recipe", this.handleAskForRecipe.bind(this));
		super.addHandler("ask:recent-recipe-searches", this.handleAskRecentRecipeSearches.bind(this));
		super.addHandler("ask:favorite-recipes", this.handleAskFavoriteRecipes.bind(this));
		super.addHandler("ask:is-favorite", this.handleAskIsFavoriteRecipe.bind(this));
		super.addHandler("set:toggle-favorite-recipe", this.toggleFavoriteRecipes.bind(this));
	}
	
	private async handleAskForRecipe(_: any, itemName: string): Promise<TCRecipe | null> {
		if (!this.parser) {
			console.error("TeamCraftParser instance is not valid.");
			return null;
		}

		const existingRecipe: TCRecipe | undefined = await this.app.getDB().tryGetRecipe(itemName);
		if (existingRecipe) {
			console.log("Recipe already exists in the database.");
			this.app.getDB().addRecentSearch(itemName);
		}

		const recipe = this.parser.getRecipeByItemIdentifier(itemName);
		if (recipe) {
			console.log("Recipe found for item:", itemName);
			await this.app.getDB().addRecentSearch(itemName);
			await this.app.getDB().addRecipe(recipe);
		}

		return recipe;
	}

	private handleAskIsFavoriteRecipe(_: any, name: string) {
		return this.app.getDB().isFavoriteRecipe(name);
	}

	private toggleFavoriteRecipes(_: any, name: string) {
		return this.app.getDB().toggleFavoriteRecipe(name);
	}

	private handleAskFavoriteRecipes() {
		return this.app.getDB().getFavoriteRecipes();
	}

	private async handleAskRecentRecipeSearches(): Promise<any> {
		const recentSearches = this.app.getDB().getRecentSearches();

		const r = await new Promise(async (resolve, _) => {
			const result = await Promise.all(recentSearches.map(async (search: DBSearchItem) => {
				const recipe = await this.app.getDB().tryGetRecipe(search.name).catch((e) => { console.log(e) });
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
}