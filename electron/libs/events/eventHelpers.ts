import { BrowserWindow, ipcMain } from "electron";
import { EventType } from "./EventTypes";

export function onReceive(events: EventType[] | EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}

export function listen(eventName: EventType, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any) {
	ipcMain.addListener(eventName, listener);
}

export function handle(events: EventType[] | EventType, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any) {
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

export async function invoke(eventName: EventType, args?: any[] | any): Promise<any> {
	return new Promise(async (resolve, reject) => {
		if(!window || !window.ipcRenderer) {
			reject(new Error("ipcRenderer is not available on the window object"));
		}

		if(Array.isArray(args)) {
			window.ipcRenderer.invoke(eventName, ...args).then(resolve).catch(() => resolve(null));
		} else {
			window.ipcRenderer.invoke(eventName, args).then(resolve).catch(() => resolve(null));
		}
	})
}

export async function send(eventName: EventType): Promise<any> {
	window.ipcRenderer.send(eventName);
}

export function sendToClient(eventName: EventType, win: BrowserWindow, args: any[] | any): void {
	win.webContents.send(eventName, args);
}