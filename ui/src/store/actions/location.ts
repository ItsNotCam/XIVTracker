import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";

export default class LocationActions extends IPCActionBase {
	askLocation = async() => {
		const newLocation = await invoke<LocationModel>("ask:location.getAll");
		this.handleLocationChange(null, newLocation);
	}

	handleLocationChange = (_: any, newLocation: LocationModel | null) => {
		if (!newLocation) return;

		const location = {
			...this.get().location,
			...newLocation
		};

		this.set({ location })
	};
}