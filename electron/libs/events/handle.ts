import { BrowserWindow, IpcRendererEvent } from "electron";
import { handle } from "./eventHelpers";
import EzWs from "../net/EzWs";
import { EzFlag } from "../net/ez/EzTypes.d";
import { JobState, Location } from "../types.d";
import TeamCraftParser from "@electron-lib/lumina/TeamCraftParser";
import { TCRecipe } from "@electron-lib/lumina/TeamCraftTypes";

export default function initHandlers(win: BrowserWindow, ipcMain: any, WebSocketClient: EzWs, Parser: TeamCraftParser) {
	handle("ask:recipe", ipcMain, (event: IpcRendererEvent, itemName: string): TCRecipe | null => {
		return Parser.getRecipeByItemIdentifier(itemName);
	});

	handle("ask:job-main", ipcMain, async (): Promise<JobState | undefined> => {
		const response = await WebSocketClient.sendAndAwaitResponse(EzFlag.JOB_MAIN);
		if (response === undefined) {
			return undefined;
		}

		try {
			return JobState.fromJson(response);
		} catch (e) {
			console.log("Error parsing job data:", (e as any).message);
		}

		return undefined;
	});

	handle("ask:location-all", ipcMain, async (): Promise<Location | undefined> => {
		const response = await WebSocketClient.sendAndAwaitResponse(EzFlag.LOCATION_ALL);
		if (response === undefined) {
			return undefined;
		}	

		try {
			return JSON.parse(response);
		} catch(e) {
			console.log("Error parsing location data:", (e as any).message);
		}

		return undefined;
	});

	handle("ask:tcp-connected", ipcMain, () => {
		return WebSocketClient?.isConnected() || false;
	});

	ipcMain.on('exit', () => {
		win.close();
	});

	ipcMain.on('minimize', () => {
		win.isMinimized() ? win.restore() : win.minimize()
	});

	ipcMain.on('maximize', () => {
		win.isMaximized() ? win.unmaximize() : win.maximize();
	});
}