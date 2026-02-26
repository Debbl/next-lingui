import { defineRouting } from 'next-lingui/routing'

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]
