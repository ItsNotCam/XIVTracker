import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { TimeModel } from "@electron/types";
import { typedListener } from "../listeners";

export default class TimeActions extends IPCActionBase {
	setWorldTime = typedListener<TimeModel>((_, { eorzea }) => {
		this.set({ worldTime: eorzea.toUpperCase() })
	})

	askWorldTime = async() => {
		try {
			const gameTime = await ipcInvoke("ask:time.get", TimeModel);
			this.set({ worldTime: gameTime.eorzea })
		} catch(e: any) {
			console.error(e);
		}
	}
}