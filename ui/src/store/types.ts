import { IPCEvent } from "@xiv-types";

export type ListenerMap = Partial<Record<IPCEvent, ListenerFunc[]>>
export type ListenerFunc = (event: Electron.IpcRendererEvent, ...args: unknown[]) => void;