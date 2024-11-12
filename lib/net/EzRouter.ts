import { BrowserWindow } from "electron";

export default function ezRoute(win: BrowserWindow, msg: any) {
	win.webContents.send("udp-position", msg);
}