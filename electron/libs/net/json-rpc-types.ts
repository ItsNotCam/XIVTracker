type JsonRpcAskMethod =
	| "rpc:job.getMain"
	| "rpc:job.getCurrent"
	| "rpc:job.getAll"

	| "rpc:location.getAll"
	| "rpc:location.getPosition"
	| "rpc:location.getArea"
	| "rpc:location.getTerritory"
	| "rpc:location.getRegion"
	| "rpc:location.getSubArea"

	| "rpc:time.get"
	| "rpc:name.get"
	| "rpc:currency.get";

type JsonRpcNotifyMethod =
	| "rpc:job.changed"

	| "rpc:location.changed"
	| "rpc:location.positionChanged"
	| "rpc:location.areaChanged"
	| "rpc:location.territoryChanged"
	| "rpc:location.regionChanged"
	| "rpc:location.subAreaChanged"

	| "rpc:time.changed"
	| "rpc:name.changed"
	| "rpc:currency.changed"

	| "rpc:loggedIn"
	| "rpc:loggedOut";

type JsonRpcMethod = JsonRpcAskMethod | JsonRpcNotifyMethod;
