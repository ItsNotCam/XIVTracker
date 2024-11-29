export default class JobState {
	public level: number;
	public job_name: string;
	public current_xp: number;
	public max_xp: number;

	constructor(level: number, jobName: string, currentXP: number, maxXP: number) {
		this.level = level;
		this.job_name = jobName;
		this.current_xp = currentXP;
		this.max_xp = maxXP;
	}

	static fromJson(json: string): JobState {
		const state = JSON.parse(json);
		return new JobState(state.level, state.job_name, state.current_xp, state.max_xp);
	}

	static createInstance = (): JobState => new JobState(0, "", 0, 0);
}
