'use client'

import { setupI18n } from '@lingui/core'
import { I18nProvider as LinguiReactProvider } from '@lingui/react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Locale, Messages } from './types'

export interface NextLinguiClientProviderProps {
  locale: Locale
  messages: Messages
  children?: ReactNode
}

export default function NextLinguiClientProvider({
  children,
  locale,
  messages,
}: NextLinguiClientProviderProps) {
  const [i18n] = useState(() => {
    const instance = setupI18n({
      locale,
      messages: {
        [locale]: messages,
      },
    })

    instance.load(locale, messages)
    instance.activate(locale)

    return instance
  })

  useEffect(() => {
    i18n.load(locale, messages)
    if (i18n.locale !== locale) {
      i18n.activate(locale)
    }
  }, [i18n, locale, messages])

  return <LinguiReactProvider i18n={i18n}>{children}</LinguiReactProvider>
}
