import { BrowserWindow } from "electron";
import { sendToClient } from "../events/EventHelpers";
import { EzFlag } from "./EzWs";

export default function ezRoute(win: BrowserWindow, msg: DeserializedPacket) {
	switch (msg.flag) {
		case EzFlag.JOB_ALL:
			try {
				const jobs = JSON.parse(msg.payload.toString());
				sendToClient("update:job-all", win, jobs);
			} catch (e) {
				sendToClient("update:job-all", win, []);
			}
			break;
		case EzFlag.JOB_MAIN:
			try {
				const job = JSON.parse(msg.payload.toString());
				sendToClient("update:job-main", win, job);
			} catch (e) {
				sendToClient("update:job-main", win, null);
			}
			break;
		case EzFlag.JOB_CURRENT:
			try {
				const job = JSON.parse(msg.payload.toString());
				console.log("Received job-main:", job);
				sendToClient("update:job-main", win, job);
			} catch (e) {
				sendToClient("update:job-main", win, null);
			}
			break;
		case EzFlag.TIME:
			try {
				const time = msg.payload.toString();
				sendToClient("update:time", win, time);
			} catch(e) {
				console.error("Failed to parse time:", e);
			}
			break;
		case EzFlag.LOCATION_ALL:
		case EzFlag.LOCATION_AREA:
		case EzFlag.LOCATION_REGION:
		case EzFlag.LOCATION_SUB_AREA:
		case EzFlag.LOCATION_TERRITORY:
			try {
				const location = JSON.parse(msg.payload.toString());
				sendToClient("update:location-*", win, location);
				sendToClient("update:location-all", win, location);
			} catch(e) {
				console.error("Failed to parse location:", e);
			}
			break;
	}
}