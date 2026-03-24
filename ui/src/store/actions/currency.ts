import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";
import z from "zod";

export default class CurrencyActions extends IPCActionBase {
	setGil = typedListener<number>((_, gil) => this.set({ gil }));
	askGil = async() => {
		try {
			const gil = await ipcInvoke("ipc-ask:currency.get", z.number());
			if(!isNaN(gil)) this.set({ gil });
		} catch(e: any) {
			console.error(e);
		}
	}
}