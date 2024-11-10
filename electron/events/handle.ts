import { BrowserWindow } from "electron";
import { EzFlags, uint6 } from "../net/ez/EzTypes";
import EzProto from "../net/ez/EzSerDe";
import EzTcpClient from "../net/EzTcp";

interface JobState {
	level: number;
	jobName: string;
	currentXP: number;
	maxXP: number;
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, TcpClient: EzTcpClient) {
	ipcMain.handle("get-main-job-info", async (): Promise<JobState | undefined> => {
		let response;
		try {
			response = await TcpClient.getData(EzFlags.JOB.MAIN);
			return response && JSON.parse(response.toString());
		} catch(e) {
			if(response) {
				console.log(response!.toString());
			}
			console.log("Error getting job data:", (e as any).message)
			return undefined;
		}
	});

	ipcMain.handle("get-location", async (): Promise<JobState | undefined> => {
		if(!TcpClient.isConnected) {
			throw new Error("No connection available");
		}

		let response;
		try {
			response = await TcpClient.getData(EzFlags.LOCATION.ALL);
			return response && JSON.parse(response.toString());
		} catch(e) {
			if(response) {
				console.log(response!.toString());
			}
			console.log("Error getting job data:", (e as any).message)
			return undefined;
		}
	});

	ipcMain.on('send-tcp-message', async (messageFlag: uint6, data: any) => {
		try {
			TcpClient?.fireAndForget(EzProto.serialize(messageFlag, data));
		} catch(e:any) {
			console.log(e);
		}
	});

	ipcMain.handle('ask-tcp-connected', () => {
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