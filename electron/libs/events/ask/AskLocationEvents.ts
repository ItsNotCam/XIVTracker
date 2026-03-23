import { LocationModel } from "@electron/types";
import AskEventBase from "../@AskEventBase";
import { LocationIPCEvent } from "../ipc-event-types";

export default class LocationEvents extends AskEventBase<LocationIPCEvent> {
	public override init() {
		super.init();
		super.addHandler("ask:location.getAll", this.handleGetLocationAll);
	}

	private handleGetLocationAll = async (): Promise<LocationModel> => {
		const { location } = await this.app.wsClient.ask<{ location: LocationModel }>('location.getAll');
		return location;
	}
}
