import { getRequestConfig } from 'next-lingui/server'

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale)!

  const { messages } = await import(`../locales/${locale}/messages.json`)

  return {
    locale,
    messages,
  }
})
