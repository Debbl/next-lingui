import { useLingui } from '@lingui/react'

export function useLocale() {
  const { i18n } = useLingui()
  return i18n.locale
}
