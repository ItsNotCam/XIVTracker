import { ipcMain, BrowserWindow } from 'electron'
import { ALL_HANDLERS } from './domains'
import type JsonRpcClient from '@backend-lib/net/JsonRpcClient'
import type EzDb from '@backend-lib/db/EzDb'
import { recipeHandlers } from './domains/recipe'
import { IPCEvent, JsonRpcNotifyMethod } from '@xiv-types'

export default class EventManager {
  constructor(
    private win: BrowserWindow,
    private ws: JsonRpcClient,
    private db: EzDb,
  ) {}

  register() {
    this.registerDomains()
    this.registerRecipes()
    this.registerWindowEvents()
  }

  private registerDomains() {
    for (const domain of ALL_HANDLERS) {
      if (domain.ask) {
        for (const [channel, handler] of Object.entries(domain.ask)) {
          ipcMain.handle(channel, (_, ...args) => handler(this.ws, ...args))
        }
      }
      if (domain.recv) {
        for (const [method, channel] of Object.entries(domain.recv) as [JsonRpcNotifyMethod, IPCEvent][]) {
          this.ws.on(method, (data) => this.win.webContents.send(channel, data))
        }
      }
    }
  }

  private registerRecipes() {
		const handlers = recipeHandlers(this.db);
		for(const [channel, handler] of Object.entries(handlers)) {
			ipcMain.handle(channel, handler);
		}
  }

  private registerWindowEvents() {
    ipcMain.on('exit', () => this.win.close())
    ipcMain.on('minimize', () => this.win.minimize())
    ipcMain.on('maximize', () =>
      this.win.isMaximized() ? this.win.unmaximize() : this.win.maximize()
    )
  }
}