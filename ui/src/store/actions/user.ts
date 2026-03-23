import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";

export default class UserActions extends IPCActionBase {
	setName = typedListener<string>((_, name) => this.set({ name }))
	askName = async() => {
		const name = await invoke<string>("ask:name.get");
		this.set({ name })
	}
}