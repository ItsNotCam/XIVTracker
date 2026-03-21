export const withCommas = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

export const toTitleCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

const ipc = () => window.ipcRenderer ?? null;

export const invoke = async(event: EventType, ...args: any[]): Promise<any> => {
	return ipc()?.invoke(event, ...args) ?? null;
}

export const addListener = (listener: (event: any, args: any[] | any) => void, ...events: EventType[]) => {
	events.forEach((eventName: string) => {
		ipc()?.on(eventName, listener);
	});
}

export const removeListener = (listener: (event: any, args: any[] | any) => void, ...events: EventType[]) => {
	events.forEach((eventName: string) => {
		ipc()?.off(eventName, listener);
	});
}

export const locAxisString = (loc: number) => loc.toFixed(2).toString().padStart(5,"0");