// import { ipcRenderer } from "electron";
// import { EventType } from "./events/EventTypes";
// import { JobState } from "./CommonTypes";
// import { TCRecipe } from "./providers/RecipeProviderTypes";
// import { DBSearchItem } from "./db/EzDbTypes";


const invokeAsync = async (channel: EventType, ...args: any[]): Promise<any> => {
	return ipcRenderer.invoke(channel, ...args);
};

const invokeSync = (channel: EventType, ...args: any[]): any => {
	return ipcRenderer.invoke(channel, ...args);
};

const askWsIsConnected = async(): Promise<boolean> => {
	return invokeAsync("ask:tcp-connected");
}

const askJobMain = async(): Promise<JobState> => {
	return invokeAsync("ask:job-main")
}

const askJobAll = async(): Promise<JobState[]> => {
	return invokeAsync("ask:job-all");
}

const askJobCurrent = async(): Promise<JobState> => {
	return invokeAsync("ask:job-current");
}

const askGameTime = async(): Promise<string> => {
	return invokeAsync("ask:time");
}

const askXp = async(): Promise<number> => {
	return invokeAsync("ask:xp");
}

const askLevel = async(): Promise<number> => {
	return invokeAsync("ask:level");
}

const askRecipe = (identifier: number | string): TCRecipe => {
	return invokeSync("ask:recipe", identifier);
}

const askRecipeRecentSearches = (): DBSearchItem => {
	return invokeSync("ask:recent-recipe-searches");
}

const askAll = async(): Promise<any> => {
	const wsConnected = new Promise(async(resolve) => {
		resolve(await askWsIsConnected());
	})

	const job = new Promise(async(resolve) => {
		const main = askJobMain();
		const all = askJobAll();
		const current = askJobCurrent();

		const result = await Promise.all([
			main, all, current
		]);

		resolve({
			main: result[0],
			all: result[1],
			current: result[2]
		});
	})

	const time = new Promise(async(resolve) => {
		resolve(await askGameTime())
	});

	const xp = new Promise(async(resolve) => {
		resolve(await askXp());
	});

	const level = new Promise(async(resolve) => {
		resolve(await askLevel());
	})

	const result = await Promise.all([
		wsConnected, job, time,
		xp, level
	]);

	return {
		wsIsConnected: result[0],
		job: result[1],
		time: result[2],
		xp: result[3],
		level: result[4]
	}
}

// export interface IPreloadApiAsk {
// 	wsIsConnected: () => Promise<boolean>,
// 	job: {
// 		main: () => Promise<JobState>,
// 		all: () => Promise<JobState[]>,
// 		current: () => Promise<JobState>
// 	},
// 	time: () => Promise<string>,
// 	xp: () => Promise<number>,
// 	level: () => Promise<number>,
// 	recipe: (identifier: number | string) => TCRecipe,
// 	recipeRecentSearches: () => DBSearchItem,
// 	all: () => Promise<any>
// }

export type AskApi = {
	wsIsConnected: askWsIsConnected,
	job: {
		main: askJobMain,
		all: askJobAll,
		current: askJobCurrent,
	},
	time: askGameTime,
	xp: askXp,
	level: askLevel,
	recipe: askRecipe,
	recipeRecentSearches: askRecipeRecentSearches,
	all: askAll
}
