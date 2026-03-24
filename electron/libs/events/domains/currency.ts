import type { DomainHandlers } from '../types'

export const currencyHandlers: DomainHandlers = {
	ask: {
		'ipc-ask:currency.get': (ws) => ws.request('rpc:currency.get')
	},
	recv: {
		'rpc:currency.changed':  'ipc-recv:currency.changed'
	}
}