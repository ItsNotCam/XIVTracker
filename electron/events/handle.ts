import { BrowserWindow } from "electron";
import { handle } from "../../lib/eventHelpers";
import EzWs from "../../lib/net/EzWs";
import { EzFlag } from "../../lib/net/ez/EzTypes.d";


class JobState {
	public level: number;
	public job_name: string;
	public current_xp: number;
	public max_xp: number;

	constructor(level: number, jobName: string, currentXP: number, maxXP: number) {
		this.level = level;
		this.job_name = jobName;
		this.current_xp = currentXP;
		this.max_xp = maxXP;
	}

	static fromJson(json: string): JobState {
		const state = JSON.parse(json);
		return new JobState(state.level, state.job_name, state.current_xp, state.max_xp);
	}

	static createInstance(): JobState {
		return new JobState(0, "", 0, 0);
	}
}

export default function initHandlers(win: BrowserWindow, ipcMain: any, WebSocketClient: EzWs) {
	handle("ask:job-main", ipcMain, async (): Promise<JobState | undefined> => {
		const response = await WebSocketClient.sendAndAwaitResponse(EzFlag.JOB_MAIN);
		if(response === undefined) {
			return undefined;
		}
		
		try {
			return JobState.fromJson(response);
		} catch(e) {
			console.log("Error parsing job data:", (e as any).message);
		}

		return undefined;
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