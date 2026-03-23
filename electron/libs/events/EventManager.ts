import XIVTrackerApp from "../../app";
import { BrowserWindow } from "electron";
import WindowEvents from "./sys/WindowEvents";
import AskEventBase from "./@AskEventBase";
import RecvEventBase from "./@RecvEventBase";
import {
	AskConnectionEvents,
	AskCurrencyEvents,
	AskJobEvents,
	AskLocationEvents,
	AskNameEvents,
	AskRecipeEvents,
	AskTimeEvents
} from "./ask";
import { 
	RecvLocationEventAll, 
	RecvLocationEventArea, 
	RecvLocationEventPosition,
	RecvLocationEventRegion,
	RecvLocationEventSubArea,
	RecvLocationEventTerritory 
} from "./recv/location";

import { RecvLoginEvent, RecvLogoutEvent } from "./recv/login-logout";
import { RecvJobCurrentEvent } from "./recv/jobs";
import { RecvTimeEvent } from "./recv/time";
import RecvNameEvent from "./recv/name/RecvName";
import RecvCurrencyEvent from "./recv/currency/RecvCurrencyEvent";


export default class EventManager implements Disposable {
	private readonly app: XIVTrackerApp;

	private windowEvents: WindowEvents;
	private AskEvents: AskEventBase[];
	private RecvEvents: Map<JsonRpcNotifyMethod, RecvEventBase>;

	constructor(app: XIVTrackerApp) {
		if (app === undefined) {
			throw new Error("App is undefined");
		}

		this.app = app;
		const win: BrowserWindow = this.app.win;

		this.windowEvents = new WindowEvents(win);

		this.AskEvents = [
			new AskJobEvents(app),
			new AskCurrencyEvents(app),
			new AskConnectionEvents(app),
			new AskLocationEvents(app),
			new AskRecipeEvents(app),
			new AskTimeEvents(app),
			new AskNameEvents(app),
		];

		this.RecvEvents = new Map<JsonRpcNotifyMethod, RecvEventBase<any>>([
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
		this[Symbol.dispose]();
	}

	[Symbol.dispose] = () => {
		this.windowEvents[Symbol.dispose]();
		this.AskEvents = [];

		for (const method of this.RecvEvents.keys()) {
			this.app.wsClient.off(method);
		}
		this.RecvEvents.clear();
	}
}
