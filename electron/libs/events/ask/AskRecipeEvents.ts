import XIVTrackerApp from "@backend/app";
import AskEventBase from "../@AskEventBase";
import RecipeProvider from "@backend-lib/db/RecipeProvider";
import { RecipeIPCEvent } from "../ipc-event-types";

export default class RecipeEvents extends AskEventBase<RecipeIPCEvent> {
	private readonly parser: RecipeProvider;

	constructor(app: XIVTrackerApp) {
		super(app);
		this.parser = new RecipeProvider();
	}

	public override init = () => {
		super.init();
		
		this.parser.init();
		
		super.addHandler("ipc:recipe.get", this.handleAskForRecipe);
		super.addHandler("ipc:recipe.getRecentSearches", this.handleAskRecentRecipeSearches);
		super.addHandler("ipc:recipe.getFavorites", this.handleAskFavoriteRecipes);
		super.addHandler("ipc:recipe.isFavorite", this.handleAskIsFavoriteRecipe);
		super.addHandler("ipc:recipe.toggleFavorite", this.toggleFavoriteRecipes);
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
				const recipe = await this.app.db.tryGetRecipe(search.name).catch(console.error);
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