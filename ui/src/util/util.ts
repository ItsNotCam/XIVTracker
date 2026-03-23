import { IPCEvent } from "@electron-lib/events/ipc-event-types";
import { ListenerFunc } from "@ui/store/listeners";
import { z } from "zod";

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

export function ipcInvoke<S extends z.ZodType>(
  event: IPCEvent,
  schema: S,
  ...args: unknown[]
): Promise<z.infer<S>>;

export function ipcInvoke(
  event: IPCEvent,
  schema?: undefined,
  ...args: unknown[]
): Promise<unknown>;

export async function ipcInvoke(
  event: IPCEvent,
  schema?: z.ZodType,
  ...args: unknown[]
): Promise<unknown> {
	const result = await ipc().invoke(event, ...args);
  if (schema) return schema.parse(result);
  return result;
}

export const addIpcEventListener = (listenerFn: ListenerFunc, ...events: IPCEvent[]) => {
	events.forEach((ipcEventName: string) => {
		ipc().on(ipcEventName, listenerFn);
	});
}

export const removeIpcEventListener = (listenerFn: ListenerFunc, ...events: IPCEvent[]) => {
	events.forEach((ipcEventName: string) => {
		ipc().off(ipcEventName, listenerFn);
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
