import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { TimeModel } from "@electron/types";
import { typedListener } from "../listeners";

export default class TimeActions extends IPCActionBase {
	setWorldTime = typedListener<string>((_, worldTime) => this.set({ worldTime }))

	askWorldTime = async() => {
		const gameTime = await invoke<TimeModel>("ask:time.get");
		const worldTime = gameTime?.eorzea?.toUpperCase() ?? this.get().worldTime;
		this.set({ worldTime })
	}
}