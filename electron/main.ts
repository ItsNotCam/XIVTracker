import { app, BrowserWindow } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import UpdateTCData from "../electron/data/updateTCData.mjs";
import XIVTrackerApp from './app';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'] + "ui\\index.html"
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
let TrackerApp: XIVTrackerApp | null;

async function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC || "", 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.mjs'),
		},
		autoHideMenuBar: true,
		frame: false,
		minWidth: 800,
		alwaysOnTop: true,
	})

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	return win;
}

app.on('window-all-closed', () => {
	if(process.platform == 'darwin') {
		return;
	}

	if(TrackerApp) {
		TrackerApp.dispose();
	}

	app.quit();
	win = null;
})

app.whenReady().then(async() => {
	await UpdateTCData();

	let win: BrowserWindow;
	if(BrowserWindow.getAllWindows().length === 0) {
		win = await createWindow();
	} else {
		win = BrowserWindow.getAllWindows()[0];
	}

	TrackerApp = await new XIVTrackerApp(win).init();
});
