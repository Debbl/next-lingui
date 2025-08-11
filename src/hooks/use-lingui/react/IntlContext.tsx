import { createContext } from 'react'
import type { Formatters, IntlCache } from '../core/formatters'
import type { InitializedIntlConfig } from '../core/IntlConfig'

export type IntlContextValue = InitializedIntlConfig & {
  formatters: Formatters
  cache: IntlCache
}

const IntlContext = createContext<IntlContextValue | undefined>(undefined)

export default IntlContext
