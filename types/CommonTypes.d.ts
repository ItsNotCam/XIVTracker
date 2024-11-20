enum DataTypes {
	position, rotation
}

interface Position {
	x: number;
	y: number;
}

interface Rotation {
	rot: number;
}

interface Job {
	level: number;
	job_name: string;
	current_xp: number;
	max_xp: number;
}

interface MaterialJob {
	name: string;
	id: number;
	level: number;
}

interface Experience {
	xp_current: number,
	xp_max: number,
	level: number
}

interface SheetObject {
	name: string;
	id: string;
}

interface Location {
	region?: SheetObject;
	territory?: SheetObject;
	area?: SheetObject;
	sub_area?: SheetObject;
	housing_ward?: SheetObject;
	position?: Position;
	radius?: number;
}

interface Material {
	name: string;
	id: number;
	icon: string;
	jobs: MaterialJob[];
	materials: Material[];
	location: Location;
}

class JobState {
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

type Recipe = {
	id: number;
	amount: number;
	quality: number;
	name?: string;
	icon_path?: string;
	ingredients?: Recipe[];
}
