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

// process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST
process.env.VITE_PUBLIC = RENDERER_DIST;

let App: XIVTrackerApp | null;

function createWindow() {
	const win: BrowserWindow = new BrowserWindow({
		icon: path.join(process.env.VITE_PUBLIC || "", 'electron-vite.svg'),
		webPreferences: {
			preload: path.join(__dirname, 'preload.ts'),
			// contextIsolation: true
		},
		autoHideMenuBar: true,
		frame: false,
		minWidth: 800
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL)
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(RENDERER_DIST, 'index.html'))
	}

	console.log(win);

	return win;
}

app.whenReady().then(async() => {
	try {
		await UpdateTCData();
	} catch(e: any) {
		console.log("Failed to update teamcraft data:", e.message);
	}

	let win: BrowserWindow;
	try {
		win = createWindow();
	} catch(e: any) {
		throw `Failed to create window: ${e.message}`;
	}

	try {
		App = new XIVTrackerApp(win);
		await App.init();
	} catch(e: any) {
		throw `Failed to initialize app: ${e.message}`;
	}

	app.on('window-all-closed', () => {
		if (process.platform !== 'darwin') {
			app.quit()
			win.destroy()
		}
	})

	// app.on('activate', () => {
	// 	if (BrowserWindow.getAllWindows().length === 0) {
	// 		createWindow();
	// 	}
	// })
});
