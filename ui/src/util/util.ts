import { ListenerFunc } from "@ui/store/listeners";
import { ZodType } from "zod";

export const withCommas = (num: number) => {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
}

export const toTitleCase = (str: string) => {
	return str.replace(/\w\S*/g, (txt) => `${txt.slice(0,1).toUpperCase()}${txt.slice(1)}`);
}

const ipc = () => {
	if(!window.ipcRenderer)	throw new Error("IPCRenderer does not exist")
	return window.ipcRenderer;
}

export const invoke = async<T, S extends ZodType<T> | undefined = undefined>(
	event: IPCEvent, 
	schema?: S,
	...args: unknown[]
): Promise<T> => {
	const connector = ipc();

	try {
		const result = connector.invoke(event, ...args ?? []);
		if(schema) return schema.parse(result) as T;
		return result;
	} catch(e: any) {
		throw new Error(`Failed to invoke ipc renderer action: ${e}`)
	}
}

export const addListener = (listener: ListenerFunc, ...events: IPCEvent[]) => {
	events.forEach((eventName: string) => {
		ipc().on(eventName, listener);
	});
}

export const removeListener = (listener: ListenerFunc, ...events: IPCEvent[]) => {
	events.forEach((eventName: string) => {
		ipc().off(eventName, listener);
	});
}

export const locAxisString = (loc: number) => loc.toFixed(2).toString().padStart(5,"0");


export const getRealTime = (): string => {
	const date = new Date();
	const minutes = date.getMinutes().toString().padStart(2, '0');
	const AMPM = date.getHours() >= 12 ? 'PM' : 'AM';

	let hours = date.getHours();
	if (hours === 0) {
		hours = 12;
	} else {
		hours = hours > 12 ? hours - 12 : hours;
	}

	const hoursStr = hours.toString().padStart(2, '0');
	return `${hoursStr}:${minutes} ${AMPM}`;
}
