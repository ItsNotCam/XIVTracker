import { BrowserWindow } from "electron";
import { DeserializedPacket, EzFlag } from "./EzTypes.d";
import { sendToClient } from "../events/EventHelpers";

export default function ezRoute(win: BrowserWindow, msg: DeserializedPacket) {
	switch (msg.flag) {
		case EzFlag.JOB_MAIN:
			try {
				const job = JSON.parse(msg.payload.toString());
				sendToClient("update:job-main", win, job);
			} catch (e) {
				sendToClient("update:job-main", win, null);
			}
			break;
	}
}