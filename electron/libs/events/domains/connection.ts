import type { DomainHandlers } from '@xiv-types'

export const connectionHandlers: DomainHandlers = {
	ask: {
    'ipc-ask:connection.isConnected': (ws) => ws.isConnected()
	}
}