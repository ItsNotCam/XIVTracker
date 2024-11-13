import "@lib/"
import { Experience, Job, Location } from "@lib/types";

const Events: { [key: string]: any } = {
	/* SOCKET COMMUNICATION */
	// base
	"tcp-connected": (connected: boolean) => {},
	"heartbeat": (message: boolean) => {},

	// global
	"global:renderer-ready": () => {},
	
	// recv
	"update:gil": () => {},
	"update:location-all": () => {},
		"update:location-position"	: (location: Location) => {},
		"update:location-area"			: (location: Location) => {},
		"update:location-subarea"		: (location: Location) => {},
		"update:location-territory"	: (location: Location) => {},
	"update:time": () => {},
	"update:inventory": () => {},
	"update:job-all"			: (job: Job) => {},
		"update:job-main"		: (job: Job) => {},
		"update:job-current": (job: Job) => {},
	"update:xp"		: (experience: Experience) => {},
	"update:level": (experience: Experience) => {},
	
	// ask general
	"ask:tcp-connected": () => {},
	"ask:all"			: () => {},
	
	// ask specific
	"ask:gil"			: () => {},
	"ask:location-all"	: () => {},
		"ask:location-position"	: (location: Location) => {},
		"ask:location-area"			: (location: Location) => {},
		"ask:location-subarea"	: (location: Location) => {},
		"ask:location-territory": (location: Location) => {},
	"ask:time"		: () => {},
	"ask:inventory"	: () => {},
	"ask:job-all"	  : (job: Job) => {},
		"ask:job-main"		: (job: Job) => {},
		"ask:job-current"	: (job: Job) => {},
	"ask:xp"		: (experience: Experience) => {},
	"ask:level"	: (experience: Experience) => {}
};

export default Events;