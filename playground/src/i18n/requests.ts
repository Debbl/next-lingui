import { getRequestConfig } from 'next-lingui/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requestedLocale = await requestLocale
  const locale =
    requestedLocale &&
    routing.locales.includes(
      requestedLocale as (typeof routing.locales)[number],
    )
      ? requestedLocale
      : routing.defaultLocale

  const { messages } = await import(`../locales/${locale}/messages.json`)

  return {
    locale,
    messages,
  }
})
