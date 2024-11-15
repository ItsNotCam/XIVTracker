export enum DataTypes {
	position, rotation
}

export interface Position {
	x: number;
	y: number;
}

export interface Rotation {
	rot: number;
}

export interface Job {
	level: number;
	job_name: string;
	current_xp: number;
	max_xp: number;
}

export interface MaterialJob {
	name: string;
	id: number;
	level: number;
}

export interface Experience {
	xp_current: number,
	xp_max: number,
	level: number
}

export interface SheetObject {
	name: string;
	id: string;
}

export interface Location {
	region?: SheetObject;
	territory?: SheetObject;
	area?: SheetObject;
	sub_area?: SheetObject;
	housing_ward?: SheetObject;
	position?: Position;
	radius?: number;
}

export interface Material {
	name: string;
	id: number;
	icon: string;
	jobs: MaterialJob[];
	materials: Material[];
	location: Location;
}

export type EventType =
	"tcp-connected" |
	"heartbeat" |

	// recv
	"update:gil" |
	"update:location-*" |
	"update:location-all" |
	"update:location-position" |
	"update:location-area" |
	"update:location-subarea" |
	"update:location-territory" |
	"update:time" |
	"update:inventory" |
	"update:job-*" |
	"update:job-all" |
	"update:job-main" |
	"update:job-current" |
	"update:xp" |
	"update:level" |

	// ask general
	"ask:tcp-connected" |
	"ask:all" |

	// ask specific
	"ask:gil" |
	"ask:location-*" | // wildcard - called every time any location update event is thrown - reduces the amount of listeners required
	"ask:location-all" |
	"ask:location-position" |
	"ask:location-area" |
	"ask:location-subarea" |
	"ask:location-territory" |
	"ask:time" |
	"ask:inventory" |
	"ask:job-*" | // wildcard - called every time any job update event is thrown - reduces the amount of listeners required
	"ask:job-all" |
	"ask:job-main" |
	"ask:job-current" |
	"ask:xp" |
	"ask:level" |

	"ask:recipe" | 

	// global
	"broadcast:renderer-ready" |
	"broadcast:tcp-connected" |
	"renderer-ready" |
	"setup-complete"

export class JobState {
	public level: number;
	public job_name: string;
	public current_xp: number;
	public max_xp: number;

	constructor(level: number, jobName: string, currentXP: number, maxXP: number) {
		this.level = level;
		this.job_name = jobName;
		this.current_xp = currentXP;
		this.max_xp = maxXP;
	}

	static fromJson(json: string): JobState {
		const state = JSON.parse(json);
		return new JobState(state.level, state.job_name, state.current_xp, state.max_xp);
	}

	static createInstance(): JobState {
		return new JobState(0, "", 0, 0);
	}
}

export type Recipe = {
	id: number;
	amount: number;
	quality: number;
	name?: string;
	icon_path?: string;
	ingredients?: Recipe[];
}