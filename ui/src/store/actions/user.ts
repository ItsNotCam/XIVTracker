import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";

export default class UserActions extends IPCActionBase {
	setName = (_: any, name: string) => this.set({ name })
	askName = async() => {
		const name = await invoke<string>("ask:name.get");
		this.set({ name })
	}
}