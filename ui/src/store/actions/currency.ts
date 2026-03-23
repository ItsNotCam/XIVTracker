import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";
import z from "zod";

export default class CurrencyActions extends IPCActionBase {
	setGil = typedListener<number>((_, gil) => this.set({ gil }));
	askGil = async() => {
		try {
			const gil = await ipcInvoke("ask:currency.get", z.number());
			if(!isNaN(gil)) return gil
			throw new Error("Failed to get gil")
		} catch(e: any) {
			console.error(e);
		}
	}
}