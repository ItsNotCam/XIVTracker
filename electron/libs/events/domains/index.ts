import { jobHandlers } from './jobs'
import { currencyHandlers } from './currency'
import { connectionHandlers } from './connection'
import { locationHandlers } from './location'
import { timeHandlers } from './time'
import { nameHandlers } from './name'
import { loginLogoutHandlers } from './login-logout'
import type { DomainHandlers } from '@xiv-types'

export const ALL_HANDLERS: DomainHandlers[] = [
  jobHandlers,
  currencyHandlers,
  connectionHandlers,
  locationHandlers,
  timeHandlers,
  nameHandlers,
  loginLogoutHandlers,
]