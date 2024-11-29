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

interface XIVJob {
	level: number;
	job_name: string;
	current_xp: number;
	max_xp: number;
}

interface XIVLocation {
	region?: SheetObject;
	territory?: SheetObject;
	area?: SheetObject;
	subarea?: SheetObject;
	ward?: SheetObject;
	position?: Position;
	radius?: number;
}