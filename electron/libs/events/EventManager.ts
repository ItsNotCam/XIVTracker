import XIVTrackerApp from "../../app";
import { BrowserWindow } from "electron";

import EventBase from "./EventBase";

import JobEvents from "./ask/AskJobEvents";
import CurrencyEvents from "./ask/AskCurrencyEvents";
import ConnectionEvents from "./ask/AskConnectionEvents";
import LocationEvents from "./ask/AskLocationEvents";
import RecipeEvents from "./ask/AskRecipeEvents";
import TimeEvents from "./ask/AskTimeEvents";
import NameEvents from "./ask/AskNameEvents";
import WindowEvents from "./sys/WindowEvents";

import RecvLoginEvent from "./recv/login-logout/RecvLoginEvent";
import RecvLogoutEvent from "./recv/login-logout/RecvLogoutEvent";

import RecvEventBase from "./recv/RecvEventBase";
import RecvJobCurrentEvent from "./recv/jobs/RecvJobCurrentEvent";

import RecvLocationEventAll from "./recv/location/RecvLocationEventAll";
import RecvLocationEventArea from "./recv/location/RecvLocationEventArea";
import RecvLocationEventRegion from "./recv/location/RecvLocationEventRegion";
import RecvLocationEventSubArea from "./recv/location/RecvLocationEventSubArea";
import RecvLocationEventPosition from "./recv/location/RecvLocationEventPosition";
import RecvLocationEventTerritory from "./recv/location/RecvLocationEventTerritory";

import RecvTimeEvent from "./recv/time/RecvTimeEvent";
import RecvNameEvent from "./recv/name/RecvName";
import RecvCurrencyEvent from "./recv/currency/RecvCurrencyEvent";

export default class EventManager implements IDisposable {
	private readonly app: XIVTrackerApp;

	private AskEvents: EventBase[];
	private RecvEvents: Map<JsonRpcNotifyMethod, RecvEventBase>;

	constructor(app: XIVTrackerApp) {
		if (app === undefined) {
			throw new Error("App is undefined");
		}

		this.app = app;
		const win: BrowserWindow = this.app.win;

		this.AskEvents = [
			new JobEvents(app),
			new CurrencyEvents(app),
			new ConnectionEvents(app),
			new LocationEvents(app),
			new RecipeEvents(app),
			new TimeEvents(app),
			new NameEvents(app),
			new WindowEvents(win)
		];

		this.RecvEvents = new Map<JsonRpcNotifyMethod, RecvEventBase>([
			['loggedIn', new RecvLoginEvent(win)],
			['loggedOut', new RecvLogoutEvent(win)],

			['job.changed', new RecvJobCurrentEvent(win)],

			['location.changed', new RecvLocationEventAll(win)],
			['location.areaChanged', new RecvLocationEventArea(win)],
			['location.positionChanged', new RecvLocationEventPosition(win)],
			['location.regionChanged', new RecvLocationEventRegion(win)],
			['location.subAreaChanged', new RecvLocationEventSubArea(win)],
			['location.territoryChanged', new RecvLocationEventTerritory(win)],

			['time.changed', new RecvTimeEvent(win)],
			['name.changed', new RecvNameEvent(win)],

			['currency.changed', new RecvCurrencyEvent(win)]
		]);
	}

	public init = async () => {
		this.AskEvents.forEach((event) => event.init());

		for (const [method, handler] of this.RecvEvents) {
			this.app.wsClient.on(method, (params) => handler.handle(params));
		}
	}

	public dispose = () => {
		this.AskEvents.forEach((event) => {
			console.log(`[${this.constructor.name}] -= ${event.constructor.name}`);
			event.dispose()
		});
		this.AskEvents = [];

		for (const method of this.RecvEvents.keys()) {
			this.app.wsClient.off(method);
		}
		this.RecvEvents.clear();
	}
}
