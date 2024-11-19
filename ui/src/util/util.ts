export const withCommas = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const toTitleCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}

export const invoke = async(event: string, ...args: any[]): Promise<any> => {
	return await window.ipcRenderer.invoke(event, ...args);
}

export const onReceive = (events: string | string[], listener: (event: any, args: any[] | any) => void) => {
	if(Array.isArray(events)) {
		events.forEach((eventName: string) => {
			window.ipcRenderer.on(eventName, listener);
		});
	} else {
		window.ipcRenderer.on(events, listener);
	}
}