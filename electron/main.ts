import dotenv from 'dotenv';
dotenv.config({
	path: "../.env"
});

import { app, BrowserWindow, ipcMain } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import EzUdpServer from './net/ezUdp'
import { EzTcpServer, EzTcpClient } from './net/ezTcp'
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
let UdpClient: EzUdpServer | null;
let TcpClient: EzTcpClient | null;
let TcpServer: EzTcpServer | null;

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
	const udpServer = new EzUdpServer((msg: Buffer) => {
		const data: any = ezDeserialize(msg, msg.length);
		ezRoute(data);
	});

	const tcpServer = new EzTcpServer((msg: Buffer) => {
		const data: any = ezDeserialize(msg, msg.length);
		ezRoute(data);
	});

	const tcpClient = new EzTcpClient();

	ipcMain.handle('send-tcp-message', async (data: any) => {
		try {
			tcpClient.send(ezSerialize(data));
			return { success: 'Message sent' }
		} catch(e:any) {
			console.log(e);
			return { error: 'An error occurred' }
		}
	});
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
		UdpClient?.close();
		TcpClient?.close();
		TcpServer?.close();

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
