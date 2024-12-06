export default class JobState {
	private _level: number;
	private _job_name: string;
	private _current_xp: number;
	private _max_xp: number;

	constructor(level: number, jobName: string, currentXP: number, maxXP: number) {
		this._level = level;
		this._job_name = jobName;
		this._current_xp = currentXP;
		this._max_xp = maxXP;
	}

	public get level(): number { return this._level };
	public get job_name(): string { return this._job_name };
	public get current_xp(): number { return this._current_xp };
	public get max_xp(): number { return this._max_xp };

	public set level(level: number) { this._level = level };
	public set job_name(jobName: string) { this._job_name = jobName };
	public set current_xp(currentXP: number) { this._current_xp = currentXP };
	public set max_xp(maxXP: number) { this._max_xp = maxXP };

	static fromJson(json: string): JobState {
		const state = JSON.parse(json);
		return new JobState(state.level, state.job_name, state.current_xp, state.max_xp);
	}

	static createInstance = (): JobState => new JobState(0, "", 0, 0);
}
