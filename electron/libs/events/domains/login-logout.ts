import type { DomainHandlers } from '@xiv-types'

export const loginLogoutHandlers: DomainHandlers = {
	ask: { },
	recv: {
		'rpc:loggedIn':   'ipc-recv:loggedIn',
		'rpc:loggedOut':   'ipc-recv:loggedOut'
	}
}