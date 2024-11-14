import { BrowserWindow } from "electron";
import { DeserializedPacket, EzFlag } from "./ez/EzTypes.d";
import { sendToClient } from "../eventHelpers";

export default function ezRoute(win: BrowserWindow, msg: DeserializedPacket) {
	console.log("ezRoute", msg.id, msg.flag, msg.payload);
	win.webContents.send("ez-route", msg);
	switch(msg.flag) {
		case EzFlag.JOB_MAIN:
			sendToClient("update:job-main", win, msg);
			break;
	}
}