import XIVTrackerApp from "../../app";

import JobEvents from "./ask-events/AskJobEvents";
import CurrencyEvents from "./ask-events/AskCurrencyEvents"; // Corrected import
import ConnectionEvents from "./ask-events/AskConnectionEvents";
import LocationEvents from "./ask-events/AskLocationEvents";
import RecipeEvents from "./ask-events/AskRecipeEvents";
import TimeEvents from "./ask-events/AskTimeEvents";
import WindowEvents from "./recv-events/WindowEvents";
import NameEvents from "./ask-events/AskNameEvents";
import EventBase from "./EventBase";

export default class EventRegister implements IDisposable {
	private readonly app: XIVTrackerApp;

	// ask events
	private Events: EventBase[];

	constructor(app: XIVTrackerApp) {
		if(app === undefined) {
			throw new Error("App is undefined");
		}

		this.app = app;

		this.Events = [
			new JobEvents(app),
			new CurrencyEvents(app),
			new ConnectionEvents(app),
			new LocationEvents(app),
			new RecipeEvents(app),
			new TimeEvents(app),
			new NameEvents(app),
			new WindowEvents(this.app.getWindow())
		];
	}

	public init() {
		this.Events.forEach((event) => event.init());
	}

	public dispose(): void {
		this.Events.forEach((event) => {
			console.log(`[${this.constructor.name}] -= ${event.constructor.name}`);
			event.dispose()
		});
	}
}