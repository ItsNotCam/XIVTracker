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