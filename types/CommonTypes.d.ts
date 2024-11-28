import { SheetObject } from "RecipeTypes";

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

interface Location {
	region?: SheetObject;
	territory?: SheetObject;
	area?: SheetObject;
	sub_area?: SheetObject;
	housing_ward?: SheetObject;
	position?: Position;
	radius?: number;
}


