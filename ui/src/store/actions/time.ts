import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { TimeModel } from "@electron/types";
import z from "zod";

export default class TimeActions extends IPCActionBase {
	setWorldTime = (_: any, worldTime: string) => this.set({ worldTime })
	askWorldTime = async() => {
		const gameTime = await invoke<TimeModel>("ask:time.get", z.number());
		const worldTime = gameTime?.eorzea?.toUpperCase() ?? this.get().worldTime;
		this.set({ worldTime })
	}
}