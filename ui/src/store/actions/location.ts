import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { LocationModel } from "@backend/types";
import { typedListener } from "../listeners";

export default class LocationActions extends IPCActionBase {
	askLocation = async() => {
		const newLocation = await ipcInvoke("ipc-ask:location.getAll", LocationModel);
		this.changeLocation(newLocation);
	}

	handleLocationChange = typedListener<LocationModel>((_, newLocation) => this.changeLocation(newLocation)); 
	
	changeLocation = (newLocation: LocationModel) => {
		if (!newLocation) return;

		const location = {
			...this.get().location,
			...newLocation
		};

		this.set({ location })
	}

}