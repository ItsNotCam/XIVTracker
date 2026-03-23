import { invoke } from "@ui/util/util";
import IPCActionBase from "./action";

export default class ConnectionActions extends IPCActionBase {
	askConnectionStatus = async() => {
		try {
			const connected = await invoke<boolean>("ask:connection.isConnected");
			this.set({ socketConnected: connected === true })
		} catch(e: any) {
			console.error(e);
		}
	}
}