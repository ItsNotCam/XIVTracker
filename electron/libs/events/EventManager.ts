import XIVTrackerApp from "../../app";
import { BrowserWindow } from "electron";
import { EzFlag } from "../../libs/net/EzWs";

import EventBase from "./EventBase";

import JobEvents from "./ask-events/AskJobEvents";
import CurrencyEvents from "./ask-events/AskCurrencyEvents";
import ConnectionEvents from "./ask-events/AskConnectionEvents";
import LocationEvents from "./ask-events/AskLocationEvents";
import RecipeEvents from "./ask-events/AskRecipeEvents";
import TimeEvents from "./ask-events/AskTimeEvents";
import WindowEvents from "./recv-events/WindowEvents";
import NameEvents from "./ask-events/AskNameEvents";


import RecvLogin from "./recv-events/login-logout/RecvLogin";
import RecvLogout from "./recv-events/login-logout/RecvLogout";

import RecvEventBase from "./recv-events/RecvEventBase";
import RecvJobAllEvent from "./recv-events/jobs/RecvJobAllEvent";
import RecvJobMainEvent from "./recv-events/jobs/RecvJobMainEvent";
import RecvJobCurrentEvent from "./recv-events/jobs/RecvJobCurrentEvent";

import RecvLocationEventAll from "./recv-events/location/RecvLocationEventAll";
import RecvLocationEventArea from "./recv-events/location/RecvLocationEventArea";
import RecvLocationEventRegion from "./recv-events/location/RecvLocationEventRegion";
import RecvLocationEventSubArea from "./recv-events/location/RecvLocationEventSubArea";
import RecvLocationEventPosition from "./recv-events/location/RecvLocationEventPosition";
import RecvLocationEventTerritory from "./recv-events/location/RecvLocationEventTerritory";

import RecvTimeEvent from "./recv-events/time/RecvTimeEvent";

export default class EventManager implements IDisposable {
	private readonly app: XIVTrackerApp;

	// ask events
	private Events: EventBase[];
	private RecvEvents: Map<EzFlag, RecvEventBase>;

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

		const win: BrowserWindow = this.app.getWindow();
		this.RecvEvents = new Map<EzFlag, RecvEventBase>([
			[EzFlag.LOGIN, new RecvLogin(win)],
			[EzFlag.LOGOUT, new RecvLogout(win)],
			
			[EzFlag.JOB_ALL, new RecvJobAllEvent(win)],
			[EzFlag.JOB_MAIN, new RecvJobMainEvent(win)],
			[EzFlag.JOB_CURRENT, new RecvJobCurrentEvent(win)],

			[EzFlag.LOCATION_ALL, new RecvLocationEventAll(win)],
			[EzFlag.LOCATION_AREA, new RecvLocationEventArea(win)],
			[EzFlag.LOCATION_POSITION, new RecvLocationEventPosition(win)],
			[EzFlag.LOCATION_REGION, new RecvLocationEventRegion(win)],
			[EzFlag.LOCATION_SUB_AREA, new RecvLocationEventSubArea(win)],
			[EzFlag.LOCATION_TERRITORY, new RecvLocationEventTerritory(win)],

			[EzFlag.TIME, new RecvTimeEvent(win)]
		]);
	}

	public ReceiveEvent(flag: EzFlag, data?: any): void {
		const event = this.RecvEvents.get(flag);
		if (event) {
			event.handle(data);
		}
	}

	public init() {
		this.Events.forEach((event) => event.init());
	}

	public dispose(): void {
		this.Events.forEach((event) => {
			console.log(`[${this.constructor.name}] -= ${event.constructor.name}`);
			event.dispose()
		});
		this.Events = [];

		Object.values(this.RecvEvents).forEach((event) => event.dispose());
		this.RecvEvents.clear();
	}
}