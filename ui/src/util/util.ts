export const withCommas = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

export const toTitleCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export const invoke = async(event: EventType, ...args: any[]): Promise<any> => {
	return await window.ipcRenderer.invoke(event, ...args);
}

export const addListener = (events: EventType | EventType[], listener: (event: any, args: any[] | any) => void) => {
	if(Array.isArray(events)) {
		events.forEach((eventName: string) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}

export const removeListener = (events: EventType | EventType[], listener: (event: any, args: any[] | any) => void) => {
	if(Array.isArray(events)) {
		events.forEach((eventName: string) => {
			window.ipcRenderer.off(eventName, listener);
		});
	} else {
		window.ipcRenderer.off(events, listener);
	}
}

export const locAxisString = (loc: number) => loc.toFixed(2).toString().padStart(5,"0");