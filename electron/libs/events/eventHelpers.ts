import { BrowserWindow, ipcMain } from "electron";
import { IPCEvent } from "./ipc-event-types";

export const onReceive = (
	events: IPCEvent[] | IPCEvent,
	listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void
) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: IPCEvent) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}

export const listen = (
	eventName: IPCEvent, 
	listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
) => {
	ipcMain.addListener(eventName, listener);
}

export const addHandler = (
	events: IPCEvent[] | IPCEvent,
	listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any
) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: IPCEvent) => {
			ipcMain.handle(eventName, listener);
		});
	} else {
		ipcMain.handle(events, listener);
	}
}

export const removeHandler = (event: IPCEvent) => {
	ipcMain.removeHandler(event);
}

export const removeHandlers = (events: IPCEvent[]) => {
	events.forEach((eventName: IPCEvent) => {
		ipcMain.removeHandler(eventName);
	});
}

export const removeListener = (
	events: IPCEvent[] | IPCEvent,
	listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void
) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: IPCEvent) => {
			ipcMain.removeListener(eventName, listener);
		});
	} else {
		ipcMain.removeListener(events, listener);
	}
}

export const emit = (
	eventName: IPCEvent,
	listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void
) => {
	if (!window || !window.ipcRenderer) {
		throw new Error("ipcRenderer is not available on the window object");
	}

	window.ipcRenderer.emit(eventName, listener);
}

export async function invoke(eventName: IPCEvent, args?: any[] | any): Promise<any> {
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

export async function send(eventName: IPCEvent): Promise<any> {
	window.ipcRenderer.send(eventName);
}

export const sendToClient = (
	eventName: IPCEvent, 
	win: BrowserWindow, 
	args?: any[] | any
): void => {
	if(args) {
		win.webContents.send(eventName, args);
	} else {
		win.webContents.send(eventName);
	}
}