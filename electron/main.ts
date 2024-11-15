import { app, BrowserWindow, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import initHandlers, { initWindowControls } from './libs/events/handle';
// import EzTcpClient from '../lib/net/EzTcp.ts.old';
// import EzUdpServer from '../lib/net/EzUdp';
import ezRoute from './libs/net/EzRouter';
import { DeserializedPacket } from './libs/net/ez/EzTypes';
import EzWs from './libs/net/EzWs';
import TeamCraftParser from './libs/lumina/TeamCraftParser';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'] + "ui\\index.html"
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
let WebSocketClient: EzWs | null;
let lParser: TeamCraftParser | null;

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC || "", 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
		},
		// alwaysOnTop: true,
		autoHideMenuBar: true,
		frame: false,
		minWidth: 800
		// transparent: true,
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	console.log("creating window");
	initWindowControls(ipcMain!, win);
	initNetworking(win);
	initHandlers(win!, ipcMain, WebSocketClient!);

	ipcMain.on("renderer-ready", (event) => {
		event.sender.send("initial-data", "ok");
		if (win) {
			win.webContents.send("setup-completed");
			console.log("window sent setup completed")
		} else {
			console.log("failed to send setup-completed - no window can be found")
		}
	});
}

const initNetworking = (win: BrowserWindow) => {
	// UdpServer = new EzUdpServer((msg: Buffer) => {
	// 	const data: any = deserialize(msg);
	// 	ezRoute(win, data);
	// });

	console.log("creating websocket client");
	try {
		WebSocketClient = new EzWs(50085, (data: DeserializedPacket) => {
			ezRoute(win, data as DeserializedPacket);
		}, (connected: boolean) => {
			win.webContents.send("broadcast:tcp-connected", connected);
		}).connect();
	} catch (e) {
		console.error("error creating websocket client:\n", e);
	}


	// TcpClient = new EzTcpClient(
	// 	(msg: Buffer) => {
	// 		const data: any = deserialize(msg);
	// 		ezRoute(win, data);
	// 	}, 
	// 	(connected: boolean) => {
	// 		console.log('TCP connected:', connected);
	// 		sendToClient('broadcast:tcp-connected', win, connected);
	// 	}
	// );

	// console.log("sending response");
	// TcpClient.sendAndAwaitResponse(EzFlag.LOCATION_ALL).then((response: Buffer) => {
	// 	console.log(response.toString());
	// });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		// UdpServer?.close();
		// TcpClient?.close();

		app.quit()
		win = null
	}
})

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(() => {
	createWindow()
});
