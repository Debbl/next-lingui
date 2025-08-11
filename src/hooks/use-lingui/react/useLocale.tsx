import useIntlContext from './useIntlContext.js'
import type { Locale } from '../core.js'

export default function useLocale(): Locale {
  return useIntlContext().locale
}
