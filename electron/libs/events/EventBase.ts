export default abstract class EventBase implements IDisposable {
	public abstract init(): void;
	public abstract dispose(): void;
}