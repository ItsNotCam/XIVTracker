import type { DomainHandlers } from '../types'

export const jobHandlers: DomainHandlers = {
  ask: {
    'ipc-ask:job.getCurrent': (ws) => ws.request('rpc:job.getCurrent'),
    'ipc-ask:job.getAll': (ws) => ws.request('rpc:job.getAll'),
  },
  recv: {
    'rpc:job.changed':   'ipc-recv:job.changed'
  }
}