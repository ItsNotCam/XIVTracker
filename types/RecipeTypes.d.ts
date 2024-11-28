import { MaterialJob } from "RecipeTypes";

export interface MaterialJob {
	name: string;
	id: number;
	level: number;
}
interface Experience {
	xp_current: number;
	xp_max: number;
	level: number;
}
export interface SheetObject {
	name: string;
	id: string;
}interface Material {
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
};

