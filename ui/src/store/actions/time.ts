import { ipcInvoke } from "@ui/util";
import IPCActionBase from "./action";
import { TimeModel } from "@xiv-types";
import { typedListener } from "../listeners";

export default class TimeActions extends IPCActionBase {
	setWorldTime = typedListener<TimeModel>((_, { eorzea }) => {
		this.set({ worldTime: eorzea.toUpperCase() })
	})

	askWorldTime = async() => {
		try {
			const gameTime = await ipcInvoke("ipc-ask:time.get", TimeModel);
			this.set({ worldTime: gameTime.eorzea })
		} catch(e: unknown) {
			console.error(e);
		}
	}
}