import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";

export default class CurrencyActions extends IPCActionBase {
	setGil = typedListener<number>((_, gil) => this.set({ gil }));
	askGil = async() => {
		try {
			const gil = await invoke<number>("ask:currency.get");
			if(!isNaN(gil)) return gil
			throw new Error("Failed to get gil")
		} catch(e: any) {
			console.error(e);
		}
	}
}