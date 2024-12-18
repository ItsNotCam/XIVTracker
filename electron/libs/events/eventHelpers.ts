import { BrowserWindow, ipcMain } from "electron";

export const onReceive = (events: EventType[] | EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}

export const listen = (eventName: EventType, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any) => {
	ipcMain.addListener(eventName, listener);
}

export const addHandler = (events: EventType[] | EventType, listener: (event: Electron.IpcMainInvokeEvent, ...args: any[]) => any) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			ipcMain.handle(eventName, listener);
		});
	} else {
		ipcMain.handle(events, listener);
	}
}

export const removeHandler = (event: EventType) => {
	ipcMain.removeHandler(event);
}

export const removeHandlers = (events: EventType[]) => {
	events.forEach((eventName: EventType) => {
		ipcMain.removeHandler(eventName);
	});
}

export const removeListener = (events: EventType[] | EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) => {
	if (Array.isArray(events)) {
		events.forEach((eventName: EventType) => {
			ipcMain.removeListener(eventName, listener);
		});
	} else {
		ipcMain.removeListener(events, listener);
	}
}

export const emit = (eventName: EventType, listener: (event: Electron.IpcRendererEvent, args: any[] | any) => void) => {
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

export const sendToClient = (eventName: EventType, win: BrowserWindow, args?: any[] | any): void => {
	if(args) {
		win.webContents.send(eventName, args);
	} else {
		win.webContents.send(eventName);
	}
}