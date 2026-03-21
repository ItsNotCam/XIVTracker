type JsonRpcAskMethod =
	| "job.getMain"
	| "job.getCurrent"
	| "job.getAll"

	| "location.getAll"
	| "location.getPosition"
	| "location.getArea"
	| "location.getTerritory"
	| "location.getRegion"
	| "location.getSubArea"

	| "time.get"
	| "name.get"
	| "currency.get";

type JsonRpcNotifyMethod =
	| "job.changed"

	| "location.changed"
	| "location.positionChanged"
	| "location.areaChanged"
	| "location.territoryChanged"
	| "location.regionChanged"
	| "location.subAreaChanged"

	| "time.changed"
	| "name.changed"
	| "currency.changed"

	| "loggedIn"
	| "loggedOut";

type JsonRpcMethod = JsonRpcAskMethod | JsonRpcNotifyMethod;
