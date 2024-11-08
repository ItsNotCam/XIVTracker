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
	jobName: string;
	currentXP: number;
	maxXP: number;
}