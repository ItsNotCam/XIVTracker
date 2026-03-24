import type { DomainHandlers } from '../types'

export const timeHandlers: DomainHandlers = {
	ask: {
		'ipc-ask:time.get': (ws) => ws.request('rpc:time.get')
	},
	recv: {
		'rpc:time.changed':  'ipc-recv:time.changed'
	}
}