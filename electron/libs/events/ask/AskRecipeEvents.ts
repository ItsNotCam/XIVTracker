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
			return null;
		}

		const existingRecipe: TCRecipe | undefined = await this.app.db.tryGetRecipe(itemName);
		if (existingRecipe) {
			this.app.db.addRecentSearch(itemName);
		}

		const recipe = this.parser.getRecipeByItemIdentifier(itemName);
		if (recipe) {
			await this.app.db.addRecentSearch(itemName);
			await this.app.db.addRecipe(recipe);
		}

		return recipe;
	}

	private handleAskIsFavoriteRecipe(_: any, name: string) {
		return this.app.db.isFavoriteRecipe(name);
	}

	private toggleFavoriteRecipes(_: any, name: string) {
		return this.app.db.toggleFavoriteRecipe(name);
	}

	private handleAskFavoriteRecipes() {
		return this.app.db.getFavoriteRecipes();
	}

	private async handleAskRecentRecipeSearches(): Promise<any> {
		const recentSearches = this.app.db.getRecentSearches();

		const r = await new Promise(async (resolve, _) => {
			const result = await Promise.all(recentSearches.map(async (search: DBSearchItem) => {
				const recipe = await this.app.db.tryGetRecipe(search.name).catch((e) => { console.log(e) });
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