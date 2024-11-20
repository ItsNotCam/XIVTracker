import { BrowserWindow, ipcMain } from "electron";
import { EventTypes, handle, listen } from "./EventHelpers";
import TeamCraftParser from "../providers/RecipeProvider";
import XIVTrackerApp from "../../app";

export default class EventRegister {
	private readonly app: XIVTrackerApp;
	private readonly parser: TeamCraftParser | null = null;

	constructor(app: XIVTrackerApp) {
		this.app = app;
		this.parser = new TeamCraftParser();
	}

	public async init(): Promise<EventRegister> {
		this.initWindowControls(this.app.getWindow());
		this.parser!.init();

		listen("update:gil", this.handleUpdateGil);

		handle("ask:tcp-connected", this.handleAskTcpConnected.bind(this));
		handle("ask:job-main", this.handleAskJobMain.bind(this));
		handle("ask:location-all", this.handleAskGetLocationAll.bind(this));
		handle("ask:recipe", this.handleAskForRecipe.bind(this));
		handle("ask:recent-recipe-searches", this.handleAskRecentRecipeSearches.bind(this));
		handle("ask:time", this.handleAskGameTime.bind(this));

		return this;
	}

	private sendToClient(event: EventType, data: any) {
		this.app.getWindow().webContents.send(event, data);
	}

	private handleAskTcpConnected() {
		if(!this.app) {
			console.error("XIVTrackerApp instance is not valid.");
		}
		return this.app.GetWebSocketClient().isConnected() || false;
	}

	private handleUpdateGil(_: any, gil: number) {
		this.sendToClient("update:gil", gil);
	}

	private async handleAskJobMain(): Promise<JobState | undefined> {
		let response: string | undefined;
		try {
			response = await this.app.GetWebSocketClient().ask(EzFlag.JOB_MAIN);
		} catch (e: any) {
			console.log("Error getting main job:", e.message);
			return undefined;
		}

		if (response === undefined) {
			return undefined;
		}

		try {
			return JobState.fromJson(response);
		} catch (e) {
			console.log("Error parsing job data:", (e as any).message);
		}

		return undefined;
	}

	private initWindowControls(win: BrowserWindow) {
		// Ensure the window object is valid
		if (!win) {
			console.error("BrowserWindow instance is not valid.");
			return;
		}

		ipcMain.on('exit', () => {
			console.log("exit event received");
			if (win) {
				win.close();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		ipcMain.on('minimize', () => {
			console.log("minimize event received");
			if (win) {
				win.isMinimized() ? win.restore() : win.minimize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});

		ipcMain.on('maximize', () => {
			console.log("maximize event received");
			if (win) {
				win.isMaximized() ? win.unmaximize() : win.maximize();
			} else {
				console.error("BrowserWindow instance is not valid.");
			}
		});
	}

	private async handleAskGetLocationAll(): Promise<Location | undefined> {
		const response = await this.app.GetWebSocketClient().ask(EzFlag.LOCATION_ALL);
		if (response === undefined) {
			return undefined;
		}

		try {
			return JSON.parse(response);
		} catch (e) {
			console.log("Error parsing location data:", (e as any).message);
		}

		return undefined;
	}

	private async handleAskForRecipe(_:any, itemName: string): Promise<TCRecipe | null> {
		const recipe = this.parser!.getRecipeByItemIdentifier(itemName);
		if(recipe !== null) {
			this.app.getDB().addRecentSearch(itemName);
		}
		return recipe;
	}

	private handleAskRecentRecipeSearches(): string[] {
		const recipes = this.app.getDB().getRecentSearches();
		return recipes.map(r => r.name) || [];
	}

	private async handleAskGameTime(): Promise<string | undefined> {
		const time = await this.app.GetWebSocketClient().ask(EzFlag.TIME);
		return time;
	}

	public close() {
		ipcMain.removeListener("update:gil", this.handleUpdateGil);

		EventTypes.forEach((event: string) => {
			ipcMain.removeHandler(event);
		});

		ipcMain.removeHandler("ask:tcp-connected");
		ipcMain.removeHandler("ask:job-main");
		ipcMain.removeHandler("ask:location-all");
		ipcMain.removeHandler("ask:recipe");
		ipcMain.removeHandler("ask:recent-recipe-searches");
		ipcMain.removeHandler("ask:time");
	}
}