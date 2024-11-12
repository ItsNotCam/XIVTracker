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

export interface JobState {
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

export interface SheetObject {
	name: string;
	id: string;
}

export interface Location {
	region: SheetObject;
	territory: SheetObject;
	area: SheetObject;
	sub_area: SheetObject;
	housing_ward: SheetObject;
	position: Position;
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