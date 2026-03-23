import { create } from 'zustand';
import { getRealTime, invoke } from '@ui/util/util';
import { createListeners, registerListeners, unregisterListeners } from './listeners';
import { JobModel, LocationModel } from '@electron/types';

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
	currentTime: "00:00 PM",
	worldTime: "00:00 PM",

	/* Currency */
	gil: 0,

	/* Job */
	job: null,
	jobs: null,
	loadingJobs: false,

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
		let listeners = createListeners(get, set)
		registerListeners(listeners);

		invoke("global:init");
		set({ isInitialized: true })

		return () => {
			clearInterval(getRealWorldTimeInterval);
			unregisterListeners(listeners);
		};
	}
}))