import RecvLocationEventBase from "./@RecvLocationEventBase";

export default class RecvLocationEventTerritory extends RecvLocationEventBase {
	public override handle = (params: any): void => {
		super.handle(params);
		this.sendToClient("location.territoryChanged", params.territory);
	}
}
