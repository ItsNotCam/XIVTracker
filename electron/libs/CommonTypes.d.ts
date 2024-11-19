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
