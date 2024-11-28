import { BrowserWindow, ipcMain } from "electron";

export const EventTypes: string[] = [
	// recv
	"update:gil",
	"update:location-*",
	"update:location-all",
	"update:location-position",
	"update:location-area",
	"update:location-subarea",
	"update:location-territory",
	"update:time",
	"update:inventory",
	"update:job-*",
	"update:job-all",
	"update:job-main",
	"update:job-current",
	"update:xp",
	"update:level",

	// ask general
	"ask:tcp-connected",
	"ask:all",

	// ask specific
	"ask:gil",
	"ask:location-*",
	"ask:location-all",
	"ask:location-position",
	"ask:location-area",
	"ask:location-subarea",
	"ask:location-territory",
	"ask:time",
	"ask:inventory",
	"ask:job-*",
	"ask:job-all",
	"ask:job-main",
	"ask:job-current",
	"ask:xp",
	"ask:level",
	"ask:recipe", 
	"ask:recent-recipe-searches",

	// global
	"broadcast:renderer-ready",
	"broadcast:tcp-connected",
	"renderer-ready",
	"setup-complete"
]



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

export function sendToClient(eventName: EventType, win: BrowserWindow, args?: any[] | any): void {
	if(args) {
		win.webContents.send(eventName, args);
	} else {
		win.webContents.send(eventName);
	}
}