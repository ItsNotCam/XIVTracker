// JobModel matches the JSON-RPC protocol spec.
// Replaces the old class-based JobState with old field names (job_name, current_xp, max_xp).
export type JobModel = {
	rowId: number;
	name: string;
	abbreviation: string;
	level: number;
	expCurrent: number;
	expMax: number;
}

export default JobModel;
