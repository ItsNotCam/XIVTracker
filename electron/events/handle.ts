import { BrowserWindow } from "electron";
import { EzFlag, uint6 } from "../../lib/net/ez/EzTypes";
import EzTcpClient from "../../lib/net/EzTcp";
import { handle } from "../../lib/eventHelpers";

interface JobState {
	level: number;
	jobName: string;
	currentXP: number;
	maxXP: number;
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, TcpClient: EzTcpClient) {
	handle("ask:job-main", ipcMain, async (): Promise<JobState | undefined> => {
		let response;
		try {
			response = await TcpClient.getData(EzFlag.JOB_MAIN);
			return response && JSON.parse(response.toString());
		} catch(e) {
			if(response) {
				console.log(response!.toString());
			}
			console.log("Error getting job data:", (e as any).message)
			return undefined;
		}
	});

	// ipcMain.handle("get-location", async (): Promise<JobState | undefined> => {
	// 	if(!TcpClient.isConnected) {
	// 		throw new Error("No connection available");
	// 	}

	// 	let response;
	// 	try {
	// 		response = await TcpClient.getData(EzFlags.LOCATION.ALL);
	// 		return response && JSON.parse(response.toString());
	// 	} catch(e) {
	// 		if(response) {
	// 			console.log(response!.toString());
	// 		}
	// 		console.log("Error getting location data:", (e as any).message)
	// 		return undefined;
	// 	}
	// });

	handle("ask:tcp-connected", ipcMain, () => {
		return TcpClient?.isConnected() || false;
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