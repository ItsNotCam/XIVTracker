import RecvEventBase from "../RecvEventBase";

export default abstract class RecvJobEventBase extends RecvEventBase {
	public override handle(_params: any): void {}
}
