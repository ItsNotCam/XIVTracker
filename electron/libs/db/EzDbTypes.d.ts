export class EzDBNotConnectedError extends Error {
	constructor(message?: string) {
		super(message || "Database is not connected");
		this.name = 'EzDBNotConnectedError';
	}
}