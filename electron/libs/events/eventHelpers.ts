import { BrowserWindow } from "electron";
import { EventType } from "../types";

export function emitOnLoad(eventName: EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) {
	// onReceive("broadcast:renderer-ready", () => {
	// 	window.ipcRenderer.on(eventName, listener);
	// });
}

export function onReceive(events: EventType[] | EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}

export function handle(events: EventType[] | EventType, ipcMain: any, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			ipcMain.handle(eventName, listener);
		});
	} else {
		ipcMain.handle(events, listener);
	}
}

export function emit(eventName: EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) {
	if (!window || !window.ipcRenderer) {
		throw new Error("ipcRenderer is not available on the window object");
	}

	window.ipcRenderer.emit(eventName, listener);
}

export async function invoke(eventName: EventType): Promise<any> {
	return new Promise(async (resolve, reject) => {
		window.ipcRenderer.invoke(eventName).then(resolve).catch(reject);
	})
}

export async function send(eventName: EventType): Promise<any> {
	window.ipcRenderer.send(eventName);
}

export function sendToClient(eventName: EventType, win: BrowserWindow, args: any[] | any): void {
	win.webContents.send(eventName, args);
}