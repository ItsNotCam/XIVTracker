import type { DomainHandlers } from '@xiv-types'

export const locationHandlers: DomainHandlers = {
	ask: {
		'ipc-ask:location.getAll': (ws) => ws.request('rpc:location.getAll'),
		'ipc-ask:location.getArea': (ws) => ws.request('rpc:location.getArea'),
		'ipc-ask:location.getPosition': (ws) => ws.request('rpc:location.getPosition'),
		'ipc-ask:location.getRegion': (ws) => ws.request('rpc:location.getRegion'),
		'ipc-ask:location.getSubArea': (ws) => ws.request('rpc:location.getSubArea'),
		'ipc-ask:location.getTerritory': (ws) => ws.request('rpc:location.getTerritory'),
	},
	recv: {
		"rpc:location.changed":  "ipc-recv:location.changed",
		'rpc:location.areaChanged': 		'ipc-recv:location.areaChanged',
		'rpc:location.positionChanged': 		'ipc-recv:location.positionChanged',
		'rpc:location.regionChanged': 		'ipc-recv:location.regionChanged',
		'rpc:location.subAreaChanged': 		'ipc-recv:location.subAreaChanged',
		'rpc:location.territoryChanged': 		'ipc-recv:location.territoryChanged'
	}
}