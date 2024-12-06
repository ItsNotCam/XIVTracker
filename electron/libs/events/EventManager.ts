import XIVTrackerApp from "../../app";
import { BrowserWindow } from "electron";
import { EzFlag } from "../../libs/net/EzWs";

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
import RecvJobAllEvent from "./recv/jobs/RecvJobAllEvent";
import RecvJobMainEvent from "./recv/jobs/RecvJobMainEvent";
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

	// ask events
	private AskEvents: EventBase[];
	private RecvEvents: Map<EzFlag, RecvEventBase>;

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

		this.RecvEvents = new Map<EzFlag, RecvEventBase>([
			[EzFlag.LOGIN, new RecvLoginEvent(win)],
			[EzFlag.LOGOUT, new RecvLogoutEvent(win)],

			[EzFlag.JOB_ALL, new RecvJobAllEvent(win)],
			[EzFlag.JOB_MAIN, new RecvJobMainEvent(win)],
			[EzFlag.JOB_CURRENT, new RecvJobCurrentEvent(win)],

			[EzFlag.LOCATION_ALL, new RecvLocationEventAll(win)],
			[EzFlag.LOCATION_AREA, new RecvLocationEventArea(win)],
			[EzFlag.LOCATION_POSITION, new RecvLocationEventPosition(win)],
			[EzFlag.LOCATION_REGION, new RecvLocationEventRegion(win)],
			[EzFlag.LOCATION_SUB_AREA, new RecvLocationEventSubArea(win)],
			[EzFlag.LOCATION_TERRITORY, new RecvLocationEventTerritory(win)],

			[EzFlag.TIME, new RecvTimeEvent(win)],
			[EzFlag.NAME, new RecvNameEvent(win)],

			[EzFlag.CURRENCY, new RecvCurrencyEvent(win)]
		]);
	}

	public ReceiveEvent = (flag: EzFlag, data?: any): void => {
		const event = this.RecvEvents.get(flag);
		event?.handle(data);
	}

	public init = () => {
		this.AskEvents.forEach((event) => event.init());
	}

	public dispose = () => {
		this.AskEvents.forEach((event) => {
			console.log(`[${this.constructor.name}] -= ${event.constructor.name}`);
			event.dispose()
		});
		this.AskEvents = [];

		this.RecvEvents.clear();
	}
}