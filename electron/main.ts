import './env';

import { app, BrowserWindow, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import EzUdpServer from './net/ezUdp'
import EzTcpClient from './net/ezTcp'
import { ezDeserialize, ezSerialize } from './net/ez-proto/ezproto';
import ezRoute from './net/ezMsgRouter';

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
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null;
let UdpServer: EzUdpServer | null;
let TcpClient: EzTcpClient | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
    },
		alwaysOnTop: true,
		autoHideMenuBar: true,
		frame: false,
		transparent: true,
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

	initHandlers(win);
}

const initHandlers = (win: BrowserWindow) => {
	UdpServer = new EzUdpServer((msg: Buffer) => {
		const data: any = ezDeserialize(msg, msg.length);
		ezRoute(win, data);
	});
	TcpClient = new EzTcpClient((msg: Buffer) => {
		const data: any = ezDeserialize(msg, msg.length);
		ezRoute(win, data);
	});

	ipcMain.on('send-tcp-message', async (data: any) => {
		try {
			TcpClient?.sendMessage(ezSerialize(data));
		} catch(e:any) {
			console.log(e);
		}
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

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
		UdpServer?.close();
		TcpClient?.close();

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

app.whenReady().then(createWindow)
