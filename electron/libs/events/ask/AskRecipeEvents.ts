import XIVTrackerApp from "../../../app";
import RecipeProvider from "../../db/RecipeProvider";
import AskEventBase from "./@AskEventBase";

export default class RecipeEvents extends AskEventBase {
	private readonly parser: RecipeProvider;

	constructor(app: XIVTrackerApp) {
		super(app);
		this.parser = new RecipeProvider();
	}

	public override init = () => {
		super.init();
		
		this.parser.init();
		super.addHandler("ask:recipe", this.handleAskForRecipe);
		super.addHandler("ask:recent-recipe-searches", this.handleAskRecentRecipeSearches);
		super.addHandler("ask:favorite-recipes", this.handleAskFavoriteRecipes);
		super.addHandler("ask:is-favorite", this.handleAskIsFavoriteRecipe);
		super.addHandler("set:toggle-favorite-recipe", this.toggleFavoriteRecipes);
	}
	
	private handleAskForRecipe = async(_: any, itemName: string): Promise<TCRecipe | null> => {
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

	private handleAskIsFavoriteRecipe = (_: any, name: string) => {
		return this.app.db.isFavoriteRecipe(name);
	}

	private toggleFavoriteRecipes = (_: any, name: string) => {
		return this.app.db.toggleFavoriteRecipe(name);
	}

	private handleAskFavoriteRecipes = () => {
		return this.app.db.getFavoriteRecipes();
	}

	private handleAskRecentRecipeSearches = async (): Promise<any> => {
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