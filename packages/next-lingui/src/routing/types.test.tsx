/* eslint-disable unused-imports/no-unused-vars */
import { describe, it } from 'vitest'
import type { DomainConfig, LocalePrefix } from './types'

describe('localePrefix', () => {
  it('does not require a type param for simple values', () => {
    const config: LocalePrefix = 'always'
  })

  it('provides strict typing for locales', () => {
    const locales = ['en', 'de'] as const
    const config: LocalePrefix<typeof locales> = {
      mode: 'always',
      prefixes: {
        en: '/en',
      },
    }
  })

  it('allows partial config', () => {
    const locales = ['en', 'de'] as const
    const config: LocalePrefix<typeof locales> = {
      mode: 'always',
      prefixes: {
        en: '/en',
      },
    }
  })

  it('provides optional typing for locales in prefixes', () => {
    const config: LocalePrefix = {
      mode: 'always',
      prefixes: {
        de: '/de',
        en: '/en',
        unknown: '/unknown',
      },
    }
  })
})

describe('domainConfig', () => {
  it('allows to define locales', () => {
    const config: DomainConfig<['en', 'de']> = {
      defaultLocale: 'en',
      domain: 'example.com',
      locales: ['en'],
    }
  })

  it('errors for unknown locales', () => {
    const config: DomainConfig<['en', 'de']> = {
      // @ts-expect-error -- Unknown locale
      defaultLocale: 'unknown',
      domain: 'example.com',
      // @ts-expect-error -- Unknown locale
      locales: ['unknown'],
    }
  })
})
