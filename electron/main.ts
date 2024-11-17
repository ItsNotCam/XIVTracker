import { app, BrowserWindow, ipcMain } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import initHandlers, { initWindowControls } from './libs/events/handle';
import ezRoute from './libs/net/EzRouter';
import { DeserializedPacket } from './@types/EzNet';
import EzWs from './libs/net/EzWs';

import UpdateTCData from "../electron/data/updateTCData.mjs";
import EzDb from '../electron/libs/db/EzDb';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'] + "ui\\index.html"
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
let WebSocketClient: EzWs | null;
let db: EzDb | null;

async function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC || "", 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
		},
		autoHideMenuBar: true,
		frame: false,
		minWidth: 800
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	initWindowControls(ipcMain!, win!);
	initNetworking(win!);
	initHandlers(win!, ipcMain, WebSocketClient!);
}

const initNetworking = (win: BrowserWindow) => {
	try {
		WebSocketClient = new EzWs(50085, (data: DeserializedPacket) => {
			ezRoute(win, data as DeserializedPacket);
		}, (connected: boolean) => {
			win.webContents.send("broadcast:tcp-connected", connected);
		}).connect();
	} catch (e) {
		console.error("error creating websocket client:\n", e);
	}
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
		win = null
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})

app.whenReady().then(async() => {
	await UpdateTCData();
	// db = await new EzDb().init();
	await createWindow();
});

async function asyncSleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
