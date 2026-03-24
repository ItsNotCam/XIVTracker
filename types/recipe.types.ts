export interface TCGatheringType {
	id: number;
	name: string;
}

export interface TCGathering {
	level: number;
	types: TCGatheringType[];
	locations: TCGatheringNode[];
}

export interface TCDrop {
	id: number;
	name: string;
	icon_path: string;
}

export interface TCPosition {
	map: number;
	zoneid: number;
	level: number;
	hp: number;
	fate: number;
	x: number;
	y: number;
	z: number;
	map_name: string;
	zone_name: string;
}

export interface TCDropSource {
	id: number;
	name: string;
	drops: TCDrop[];
	positions: TCPosition[];
}

export interface TCCrafting {
	job: number;
	job_name: string;
	level: number;
}

// recipe haha
export interface TCRecipe {
	id: number;
	amount: number;
	name: string;
	icon_path: string | undefined;
	gathering: TCGathering | null,
	drop_sources: TCDropSource[] | null;
	crafting: TCCrafting | null;
	ingredients: TCRecipe[];
}


// nodes
export interface TCGatheringNode {
	limited: boolean;
	level: number;
	type: number;
	base: number;
	legendary: boolean;
	ephemeral: boolean;
	spawns: [];
	duration: number;
	zoneid: number;
	radius: number;
	x: number;
	y: number;
	z: number;
	map: number;
	hiddenItems: number[];
	map_name: string;
	job_name: string;
	zone_name: string;
}

export interface MaterialJob {
	name: string;
	id: number;
	level: number;
}
export interface Experience {
	xp_current: number;
	xp_max: number;
	level: number;
}

export interface SheetObject {
	name: string;
	id: string;
}

export interface Material {
	name: string;
	id: number;
	icon: string;
	jobs: MaterialJob[];
	materials: Material[];
	location: Location;
}

export type Recipe = {
	id: number;
	amount: number;
	quality: number;
	name?: string;
	icon_path?: string;
	ingredients?: Recipe[];
};
