import type { DomainHandlers } from '@xiv-types'

export const nameHandlers: DomainHandlers = {
	ask: {
		'ipc-ask:name.get': (ws) => ws.request('rpc:name.get')
	},
	recv: {
		'rpc:name.changed':  'ipc-recv:name.changed'
	}
}