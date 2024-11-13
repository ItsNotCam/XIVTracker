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

export type EventType = 
	"tcp-connected" 							|
	"heartbeat" 									|
	
	// recv
	"update:gil" 									|
	"update:location-all" 				|
		"update:location-position" 	|
		"update:location-area"		 	|
		"update:location-subarea"	 	|
		"update:location-territory" |
	"update:time" 								|
	"update:inventory" 						|
	"update:job-all"		 					|
		"update:job-main"	 					|
		"update:job-current" 				|
	"update:xp"	 									|
	"update:level" 								|
	
	// ask general
	"ask:tcp-connected" 					|
	"ask:all"		 									|
	
	// ask specific
	"ask:gil"		 									|
	"ask:location-all" 						|
		"ask:location-position" 		|
		"ask:location-area"		 			|
		"ask:location-subarea" 			|
		"ask:location-territory" 		|
	"ask:time"	 									|
	"ask:inventory" 							|
	"ask:job-all"	  							|
		"ask:job-main"	 						|
		"ask:job-current" 					|
	"ask:xp"	 										|
	"ask:level"										|
	
	// global
	"broadcast:renderer-ready"		|
	"broadcast:tcp-connected"			|
	"renderer-ready"							|
	"setup-complete"
