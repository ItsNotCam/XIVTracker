import { BrowserWindow } from "electron";
import { DeserializedPacket, EzFlag } from "./ez/EzTypes.d";
import { sendToClient } from "../events/eventHelpers";

export default function ezRoute(win: BrowserWindow, msg: DeserializedPacket) {
	// console.log("ezRoute", msg.id, msg.flag, msg.payload);
	// win.webContents.send("ez-route", msg);
	console.log("ezRoute", msg.id, msg.flag, msg.payload.toString());

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