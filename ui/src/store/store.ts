import { create } from 'zustand';
import { getRealTime } from '@ui/util';
import { 
	createInitActions,
	createListeners,
	registerListeners,
	unregisterListeners 
} from './listeners';

import { JobModel, LocationModel, Recipe } from '@xiv-types';

export interface Store {
	/* Navigation */
	currentPageIdx: number
	setCurrentPageIdx(idx: number): void

	/* Connection Status */
	socketConnected: boolean

	/* Time */
	currentTime: string
	worldTime: string

	/* Currency */
	gil: number

	/* Jobs */
	job: JobModel | null
	jobs: JobModel[] | null

	/* User */
	playerName: string | null

	/* Position */
	location: LocationModel | null

	/* Recipes */
	selectedRecipe: Recipe | null
	recentSearches: Recipe[]

	/* Listeners - !!must call on app entry!! */
	init: () => () => void
	isInitialized: boolean
}

export const useStore = create<Store>((set, get) => ({
	/* Navigation */
	currentPageIdx: 0,
	setCurrentPageIdx: (idx: number) => set({ currentPageIdx: idx }),

	/* Connection Status */
	socketConnected: false,

	/* Time */
	currentTime: "00:00 AM",
	worldTime: "00:00 AM",

	/* Currency */
	gil: 0,

	/* Job */
	job: null,
	jobs: null,

	/* Name */
	playerName: null,

	/* Location */
	location: null,

	/* Recipes */
	selectedRecipe: null,
	recentSearches: [],

	isInitialized: false,

	/* On app entry initialization */
	init: () => {
		console.log("initialize called!");

		/* Intervals */
		const getRealWorldTimeInterval = setInterval(() => {
			set({ currentTime: getRealTime() })
		}, 1000);

		/* Listeners */
		const listeners = createListeners(get, set)
		registerListeners(listeners);

		/* Setup */
		const initActions = createInitActions(get, set);
		Promise.all(initActions.map(action => action()))
			.then(() => set({ isInitialized: true }))

		return () => {
			clearInterval(getRealWorldTimeInterval);
			unregisterListeners(listeners);
		};
	}
}))