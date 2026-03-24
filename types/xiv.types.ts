import z from "zod";

export type Vector3 = z.infer<typeof Vector3>;
export const Vector3 = z.object({
	x: z.number(),
	y: z.number(),
	z: z.number()
})

export type PlaceModel = z.infer<typeof PlaceModel>;
export const PlaceModel = z.object({
	rowId: z.number(),
	name: z.string()
})

export type JobModel = z.infer<typeof JobModel>;
export const JobModel = z.object({
	rowId: z.number(),
	name: z.string(),
	abbreviation: z.string(),
	level: z.number(),
	expCurrent: z.number(),
	expMax: z.number()
})

export type LocationModel = z.infer<typeof LocationModel>;
export const LocationModel = z.object({
	position: Vector3,
	area:  PlaceModel,
	territory:  PlaceModel,
	region:  PlaceModel,
	subArea:  PlaceModel
})

export type TimeModel = z.infer<typeof TimeModel>;
export const TimeModel = z.object({
	local: z.string(),
	eorzea: z.string()
})
