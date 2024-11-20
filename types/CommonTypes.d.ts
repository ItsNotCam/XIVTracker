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

type Recipe = {
	id: number;
	amount: number;
	quality: number;
	name?: string;
	icon_path?: string;
	ingredients?: Recipe[];
}
