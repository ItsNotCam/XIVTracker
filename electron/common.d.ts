interface IDisposable {
	public abstract dispose(): void;
}

interface Vector3 {
	x: number;
	y: number;
	z: number;
}

interface PlaceModel {
	rowId: number;
	name: string;
}

interface JobModel {
	rowId: number;
	name: string;
	abbreviation: string;
	level: number;
	expCurrent: number;
	expMax: number;
}

interface LocationModel {
	position: Vector3;
	area: PlaceModel;
	territory: PlaceModel;
	region: PlaceModel;
	subArea: PlaceModel;
}

interface TimeModel {
	local: string;
	eorzea: string;
}
