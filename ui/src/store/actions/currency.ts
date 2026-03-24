import { ipcInvoke } from "@ui/util/util";
import IPCActionBase from "./action";
import { typedListener } from "../listeners";
import z from "zod";

export default class CurrencyActions extends IPCActionBase {
	setGil = typedListener<{ gil: number }>((_, data) => this.set({ gil: data.gil }));
	askGil = async() => {
		try {
			const { gil } = await ipcInvoke("ipc-ask:currency.get", z.object({ gil: z.number() }));
			if(!isNaN(gil)) this.set({ gil });
		} catch(e: any) {
			console.error(e);
		}
	}
}