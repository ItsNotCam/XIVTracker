export type LocationIPCEvent = 
	// Ask: renderer → main → Dalamu
	| "ask:location.getAll"
	| "ask:location.getPosition"
	| "ask:location.getArea"
	| "ask:location.getTerritory"
	| "ask:location.getRegion"
	| "ask:location.getSubArea"
	
	// Notify: Dalamud → main → renderer
	| "recv:location.changed"
	| "recv:location.positionChanged"
	| "recv:location.areaChanged"
	| "recv:location.territoryChanged"
	| "recv:location.regionChanged"
	| "recv:location.subAreaChanged"

export type JobIPCEvent = 
	// Ask: renderer → main → Dalamud
	| "ask:job.getMain"
	| "ask:job.getCurrent"
	| "ask:job.getAll"

	// Notify: Dalamud → main → renderer
	| "recv:job.changed"
	| "recv:xp.changed"
	| "recv:level.changed"

export type TimeIPCEvent = 
	| "ask:time.get"
	| "recv:time.changed"

export type NameIPCEvent = 
	| "ask:name.get"
	| "recv:name.changed"

export type CurrencyIPCEvent = 
	| "ask:currency.get"
	| "recv:currency.changed"

export type ConnectionIPCEvent = 
	| "ask:connection.isConnected"
	| "recv:connection.changed"

	// Get: renderer → main
export type RecipeIPCEvent = 
	| "ipc:recipe.get"
	| "ipc:recipe.isFavorite"
	| "ipc:recipe.getFavorites"
	| "ipc:recipe.getRecentSearches"
	| "ipc:recipe.toggleFavorite"

export type LoginLogoutIPCEvent = 
	| "recv:loggedIn"
	| "recv:loggedOut"

	// Window controls
export type WindowIPCEvent = 
	| "exit"
	| "minimize"
	| "maximize"


export type IPCEvent =
	| "global:init"
	| LocationIPCEvent
	| JobIPCEvent
	| TimeIPCEvent
	| NameIPCEvent
	| CurrencyIPCEvent
	| ConnectionIPCEvent
	| RecipeIPCEvent
	| LoginLogoutIPCEvent
	| WindowIPCEvent
