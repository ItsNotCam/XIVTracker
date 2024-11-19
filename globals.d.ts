export {};

// import { ipcRenderer } from "electron";
// import { EventType } from "./events/EventTypes";
// import { JobState } from "./CommonTypes";
// import { TCRecipe } from "./providers/RecipeProviderTypes";
// import { DBSearchItem } from "./db/EzDbTypes";

/*
function invokeAsync(channel: EventType, ...args: any[]): Promise<any> {
  return ipcRenderer.invoke(channel, ...args);
}

function invokeSync(channel: EventType, ...args: any[]): any {
  return ipcRenderer.invoke(channel, ...args);
}

function askWsIsConnectedasync(): Promise<boolean> {
  return invokeAsync("ask:tcp-connected");
}

function askJobMainasync(): Promise<JobState> {
  return invokeAsync("ask:job-main");
}

function askJobAllasync(): Promise<JobState[]> {
  return invokeAsync("ask:job-all");
}

function askJobCurrentasync(): Promise<JobState> {
  return invokeAsync("ask:job-current");
}

function askGameTimeasync(): Promise<string> {
  return invokeAsync("ask:time");
}

function askXpasync(): Promise<number> {
  return invokeAsync("ask:xp");
}

function askLevelasync(): Promise<number> {
  return invokeAsync("ask:level");
}

function askRecipe(identifier: number | string): TCRecipe {
  return invokeSync("ask:recipe", identifier);
}

function askRecipeRecentSearches(): DBSearchItem {
  return invokeSync("ask:recent-recipe-searches");
}

function askAll(): Promise<any> {
  const wsConnected = new Promise(async (resolve) => {
    resolve(await askWsIsConnected());
  });

  const job = new Promise(async (resolve) => {
    const main = askJobMain();
    const all = askJobAll();
    const current = askJobCurrent();

    const result = await Promise.all([main, all, current]);

    resolve({
      main: result[0],
      all: result[1],
      current: result[2],
    });
  });

  const time = new Promise(async (resolve) => {
    resolve(await askGameTime());
  });

  const xp = new Promise(async (resolve) => {
    resolve(await askXp());
  });

  const level = new Promise(async (resolve) => {
    resolve(await askLevel());
  });

  const result = await Promise.all([wsConnected, job, time, xp, level]);

  return {
    wsIsConnected: result[0],
    job: result[1],
    time: result[2],
    xp: result[3],
    level: result[4],
  };
}*/

declare namespace AskApi {
  function wsIsConnected(): Promise<boolean>;

  namespace job {
    function main(): Promise<any>;
    function all(): Promise<any>;
    function current(): Promise<any>;
  }

  function askGameTime(): Promise<string>;
  function askXp(): Promise<number>;
  function askLevel(): Promise<number>;
  function askRecipe(identifier: number | string): Promise<TCRecipe>;
  function askRecipeRecentSearches(): Promise<DBSearchItem>;
  function askAll(): Promise<any>;
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
/*
declare namespace AskApi {
  const wsIsConnected = async() => {
    return await invokeAsync("ask:tcp-connected");
  }

  namespace job {
    const main = async() => {
      return await invokeAsync("ask:job-main");
    };
    const all = async() => {
      return await invokeAsync("ask:job-all");
    };
    const current = async() => {
      return await invokeAsync("ask:job-current");
    };
  }

  const askGameTime = async() => {
    return await invokeAsync("ask:time");
  };
  const askXp = async() => {
    return await invokeAsync("ask:xp");
  };
  const askLevel = async() => {
    return await invokeAsync("ask:level");
  };

  const askRecipe = (name: string) => {
    return invoke("ask:recipe", name);
  };
  const askRecentRecipeSearches = () => {
    return invokeAsync("ask:recent-recipe-searches");
  };

  const askForAllData = () => {
    return await askAll();
  };
}
*/