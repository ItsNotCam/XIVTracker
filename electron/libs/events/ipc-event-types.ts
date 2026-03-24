export type LocationIPCEvent = 
	// Ask: renderer → main → Dalamu
	| "ipc-ask:location.getAll"
	| "ipc-ask:location.getPosition"
	| "ipc-ask:location.getArea"
	| "ipc-ask:location.getTerritory"
	| "ipc-ask:location.getRegion"
	| "ipc-ask:location.getSubArea"
	
	// Notify: Dalamud → main → renderer
	| "ipc-recv:location.changed"
	| "ipc-recv:location.positionChanged"
	| "ipc-recv:location.areaChanged"
	| "ipc-recv:location.territoryChanged"
	| "ipc-recv:location.regionChanged"
	| "ipc-recv:location.subAreaChanged"

export type JobIPCEvent = 
	// Ask: renderer → main → Dalamud
	| "ipc-ask:job.getMain"
	| "ipc-ask:job.getCurrent"
	| "ipc-ask:job.getAll"

	// Notify: Dalamud → main → renderer
	| "ipc-recv:job.changed"
	| "ipc-recv:xp.changed"
	| "ipc-recv:level.changed"

export type TimeIPCEvent = 
	| "ipc-ask:time.get"
	| "ipc-recv:time.changed"

export type NameIPCEvent = 
	| "ipc-ask:name.get"
	| "ipc-recv:name.changed"

export type CurrencyIPCEvent = 
	| "ipc-ask:currency.get"
	| "ipc-recv:currency.changed"

export type ConnectionIPCEvent = 
	| "ipc-ask:connection.isConnected"
	| "ipc-recv:connection.changed"

	// Get: renderer → main
export type RecipeIPCEvent = 
	| "ipc:recipe.get"
	| "ipc:recipe.isFavorite"
	| "ipc:recipe.getFavorites"
	| "ipc:recipe.getRecentSearches"
	| "ipc:recipe.toggleFavorite"

export type LoginLogoutIPCEvent = 
	| "ipc-recv:loggedIn"
	| "ipc-recv:loggedOut"

	// Window controls
export type WindowIPCEvent = 
	| "exit"
	| "minimize"
	| "maximize"


export type IPCEvent =
	| LocationIPCEvent
	| JobIPCEvent
	| TimeIPCEvent
	| NameIPCEvent
	| CurrencyIPCEvent
	| ConnectionIPCEvent
	| RecipeIPCEvent
	| LoginLogoutIPCEvent
	| WindowIPCEvent
