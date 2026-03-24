import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { LocationModel } from "@backend/types";
import { typedListener } from "../listeners";
import z from "zod";

export default class LocationActions extends IPCActionBase {
	askLocation = async() => {
		const { location } = await ipcInvoke("ipc-ask:location.getAll", z.object({ location: LocationModel }));
		this.changeLocation(location);
	}

	handleLocationChange = typedListener<{ location: LocationModel }>((_, { location }) => this.changeLocation(location));
	
	changeLocation = (newLocation: LocationModel) => {
		if (!newLocation) return;

		const location = {
			...this.get().location,
			...newLocation
		};

		this.set({ location })
	}

}