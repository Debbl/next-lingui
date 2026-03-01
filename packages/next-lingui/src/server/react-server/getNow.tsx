import getConfigNow from './getConfigNow'
import getDefaultNow from './getDefaultNow'
import type { Locale } from '../../shared/types'

export default async function getNow(opts?: {
  locale?: Locale
}): Promise<Date> {
  return (await getConfigNow(opts?.locale)) ?? getDefaultNow()
}
