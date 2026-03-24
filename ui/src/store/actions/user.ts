import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";
import z from "zod";

export default class UserActions extends IPCActionBase {
	setName = typedListener<string>((_, name) => this.set({ name }))
	askName = async() => {
		const name = await ipcInvoke("ipc-ask:name.get", z.string());
		this.set({ name })
	}
}