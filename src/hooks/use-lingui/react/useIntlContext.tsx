import { useContext } from 'react'
import IntlContext from './IntlContext'
import type { IntlContextValue } from './IntlContext'

export default function useIntlContext(): IntlContextValue {
  const context = useContext(IntlContext)

  if (!context) {
    throw new Error(
      // eslint-disable-next-line n/prefer-global/process
      process.env.NODE_ENV !== 'production'
        ? 'No intl context found. Have you configured the provider? See https://next-intl.dev/docs/usage/configuration#server-client-components'
        : undefined,
    )
  }

  return context
}
