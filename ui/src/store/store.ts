import { create } from 'zustand';
import { getRealTime } from '@ui/util';
import { 
	createInitActions,
	createListeners,
	registerListeners,
	unregisterListeners 
} from './listeners';

import { JobModel, LocationModel } from '@xiv-types';

export interface Store {
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
	name: string | null

	/* Position */
	location: LocationModel | null

	/* Listeners - !!must call on app entry!! */
	init: () => () => void
	isInitialized: boolean
}

export const useStore = create<Store>((set, get) => ({
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
	name: null,

	/* Location */
	location: null,

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