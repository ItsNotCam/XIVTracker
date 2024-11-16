import { BrowserWindow } from "electron";
import { handle } from "./eventHelpers";
import EzWs from "../net/EzWs";
import { EzFlag } from "../net/ez/EzTypes.d";
import { JobState, Location } from "../types.d";
import TeamCraftParser from "../lumina/TeamCraftParser";
import { TCRecipe } from "../lumina/TeamCraftTypes.d";

export function initWindowControls(ipcMain: any, win: BrowserWindow) {
	// Ensure the window object is valid
	if (!win) {
		console.error("BrowserWindow instance is not valid.");
		return;
	}

	ipcMain.on('exit', () => {
		console.log("exit event received");
		if (win) {
			win.close();
		} else {
			console.error("BrowserWindow instance is not valid.");
		}
	});

	ipcMain.on('minimize', () => {
		console.log("minimize event received");
		if (win) {
			win.isMinimized() ? win.restore() : win.minimize();
		} else {
			console.error("BrowserWindow instance is not valid.");
		}
	});

	ipcMain.on('maximize', () => {
		console.log("maximize event received");
		if (win) {
			win.isMaximized() ? win.unmaximize() : win.maximize();
		} else {
			console.error("BrowserWindow instance is not valid.");
		}
	});
}

export default async function initHandlers(win: BrowserWindow, ipcMain: any, WebSocketClient: EzWs) {
	handle("ask:tcp-connected", ipcMain, () => {
		return WebSocketClient?.isConnected() || false;
	});

	handle("ask:job-main", ipcMain, async (): Promise<JobState | undefined> => {
		let response: string | undefined;
		try {
			response = await WebSocketClient.sendAndAwaitResponse(EzFlag.JOB_MAIN);
		} catch(e: any) {
			console.log("Error getting main job:", e.message);
			return undefined;
		}

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
		} catch (e) {
			console.log("Error parsing location data:", (e as any).message);
		}

		return undefined;
	});

	const Parser = await new TeamCraftParser().init();
	handle("ask:recipe", ipcMain, async (event: any, itemName: string): Promise<TCRecipe | null> => {
		return Parser.getRecipeByItemIdentifier(itemName);
	});

	handle("ask:time", ipcMain, async (): Promise<string | undefined> => {
		const time = await WebSocketClient.sendAndAwaitResponse(EzFlag.TIME);
		return time;
	});
}