import { LocationModel } from "@backend/types";
import AskEventBase from "../@AskEventBase";
import { LocationIPCEvent } from "../ipc-event-types";

export default class LocationEvents extends AskEventBase<LocationIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ipc-ask:location.getAll", this.handleGetLocationAll);
	}

	private handleGetLocationAll = async (): Promise<LocationModel> => {
		const { location } = await this.app.wsClient.request<{ location: LocationModel }>('rpc:location.getAll');
		return location;
	}
}
