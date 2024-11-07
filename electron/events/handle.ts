import { BrowserWindow } from "electron";
import EzTcpClient from "../net/ezTcp";
import { ezSerialize } from "../net/ez-proto/ezproto";

interface JobState {
	level: number;
	jobName: string;
	currentXP: number;
	maxXP: number;
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, TcpClient: EzTcpClient) {
	// ipcMain.handle("get-main-job-info", async () => {
	// 	const response = await TcpClient.sendAndAwaitResponse(Buffer.from("get-main-job-info"));
	// 	try {
	// 		const data: string[] = response.toString().split("\n");			
	// 		const result: JobState = JSON.parse(data[1]);
	// 		return result;
	// 	} catch(e:any) {
	// 		console.log(e);
	// 		return {
	// 			level: -1,
	// 			jobName: '',
	// 			currentXP: -1,
	// 			maxXP: -1
	// 		}
	// 	}
	// });

	ipcMain.handle("get-main-job-info", async () => {
		const response = await TcpClient.sendAndAwaitResponse(Buffer.from("get-main-job-info"));
		try {
			const data: string[] = response.toString().split("\n");			
			const result: JobState = JSON.parse(data[1]);
			return result;
		} catch(e:any) {
			console.log(e);
			return {
				level: -1,
				jobName: '',
				currentXP: -1,
				maxXP: -1
			}
		}
	});

	ipcMain.on('send-tcp-message', async (data: any) => {
		try {
			TcpClient?.sendMessage(ezSerialize(data));
		} catch(e:any) {
			console.log(e);
		}
	});

	// ipcMain.handle('get-main-job-info', () => {
	// 	return {
	// 		level: Math.floor(Math.random() * (90 - 10 + 1)) + 10,
	// 		jobName: 'CONJURER',
	// 		currentXP: Math.floor(Math.random() * (55000 - 10000 + 1)) + 10000,
	// 		maxXP: 55000
	// 	}
	// });

	ipcMain.handle('tcp-connected', () => {
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