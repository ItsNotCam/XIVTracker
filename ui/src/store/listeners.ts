import { StoreApi } from "zustand";
import { Store } from "./store";
import { addListener, removeListener } from "@ui/util/util";

import CurrencyActions from './actions/currency';
import TimeActions from './actions/time';
import ConnectionActions from './actions/connection';
import JobActions from './actions/job';
import UserActions from './actions/user';
import LocationActions from './actions/location';
import { IPCEvent } from "@electron-lib/events/ipc-event-types";

export const createListeners = (
	get: StoreApi<Store>['getState'],
	set: StoreApi<Store>['setState']
): ListenerMap => {

	/* Actions */
	const currencyActions = new CurrencyActions(get, set);
	const timeActions = new TimeActions(get, set);
	const connectionActions = new ConnectionActions(get, set);
	const jobActions = new JobActions(get, set);
	const userActions = new UserActions(get, set);
	const locationActions = new LocationActions(get, set);

	/* Create the Listeners */
	return {
		'global:init': [
			currencyActions.askGil,
			timeActions.askWorldTime,
			connectionActions.askConnectionStatus,
			jobActions.askJobInfo,
			jobActions.askJobs,
			userActions.askName,
			locationActions.askLocation
		],

		'recv:time.changed': [
			timeActions.setWorldTime
		],

		'ask:time.get': [],

		'recv:currency.changed': [
			currencyActions.setGil
		],

		'ask:currency.get': [
			currencyActions.askGil
		],

		'recv:connection.changed': [
			currencyActions.askGil,
			timeActions.askWorldTime,
			connectionActions.askConnectionStatus,
			jobActions.askJobInfo,
			jobActions.askJobs,
			userActions.askName,
			locationActions.askLocation
		],

		'recv:loggedOut': [],
		'recv:loggedIn': [
			locationActions.askLocation,
			currencyActions.askGil,
			timeActions.askWorldTime,
			jobActions.askJobInfo,
			userActions.askName
		],

		'ask:job.getMain': [],
		'ask:job.getCurrent': [],
		'ask:job.getAll': [],
		'recv:job.changed': [
			jobActions.handleJobChange,
			jobActions.askJobs
		],

		'recv:xp.changed': [
			jobActions.handleXpChange
		],

		'recv:level.changed': [
			jobActions.handleJobChange
		],

		'ask:location.getAll': [],
		'ask:location.getPosition': [],
		'ask:location.getArea': [],
		'ask:location.getTerritory': [],
		'ask:location.getRegion': [],
		'ask:location.getSubArea': [],
		'ask:name.get': [
			userActions.askName
		],

		'ask:connection.isConnected': [
			connectionActions.askConnectionStatus
		],

		'ipc:recipe.get': [],
		'ipc:recipe.isFavorite': [],
		'ipc:recipe.getFavorites': [],
		'ipc:recipe.getRecentSearches': [],
		'ipc:recipe.toggleFavorite': [],

		'recv:location.changed': [
			locationActions.handleLocationChange
		],
		'recv:location.positionChanged': [],
		'recv:location.areaChanged': [],
		'recv:location.territoryChanged': [],
		'recv:location.regionChanged': [],
		'recv:location.subAreaChanged': [],

		'recv:name.changed': [
			userActions.setName
		],

		'minimize': [],
		'maximize': [],
		'exit': []
	}
}

export type ListenerFunc = (event: Electron.IpcRendererEvent, ...args: unknown[]) => void;
export const typedListener = <T>(fn: (event: any, arg: T) => void): ListenerFunc => {
  return (event, ...args) => {
    fn(event, args[0] as T);
  };
}

type ListenerMap = Record<IPCEvent, ListenerFunc[]>
const castListenerEntries = (listeners: ListenerMap) => Object.entries(listeners) as [IPCEvent, ListenerFunc[]][]

export const registerListeners = (listeners: ListenerMap) => {
	castListenerEntries(listeners)
		.forEach(([event, registeredListeners]) => {
			console.log(`Registering ${registeredListeners.length} listeners for ${event}`)
			registeredListeners.forEach((listener) => addListener(listener, event))
		})
}

export const unregisterListeners = (listeners: ListenerMap) => {
	castListenerEntries(listeners)
		.forEach(([event, registeredListeners]) => {
			console.log(`Unregistering ${registeredListeners.length} listeners for ${event}`)
			registeredListeners.forEach((listener) => removeListener(listener, event))
		})
}

