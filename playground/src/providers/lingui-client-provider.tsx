'use client'
import { setupI18n } from '@lingui/core'
import { I18nProvider } from '@lingui/react'
import { useState } from 'react'
import type { Messages } from '@lingui/core'

export function LinguiClientProvider({
  locale,
  messages,
  children,
}: {
  locale: string
  messages: Messages
  children: React.ReactNode
}) {
  const [i18n] = useState(() => {
    return setupI18n({
      locale,
      messages: { [locale]: messages },
    })
  })

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
