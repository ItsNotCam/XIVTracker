import type { DomainHandlers } from '../types'

export const connectionHandlers: DomainHandlers = {
	ask: {
    'ipc-ask:connection.isConnected': (ws) => ws.isConnected()
	}
}