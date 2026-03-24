import { ipcInvoke } from "@ui/util";
import IPCActionBase from "./action";
import z from "zod";

export default class ConnectionActions extends IPCActionBase {
	askConnectionStatus = async() => {
		try {
			const connected = await ipcInvoke("ipc-ask:connection.isConnected", z.boolean());
			this.set({ socketConnected: connected === true })
		} catch(e: unknown) {
			console.error(e);
		}
	}
}