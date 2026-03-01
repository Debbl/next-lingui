import { cache } from 'react'
import getConfig from './getConfig'
import type { Locale } from '../../shared/types'

async function getTimeZoneCachedImpl(locale?: Locale) {
  const config = await getConfig(locale)
  return config.timeZone
}
const getTimeZoneCached = cache(getTimeZoneCachedImpl)

export default async function getTimeZone(opts?: {
  locale?: Locale
}): Promise<string | undefined> {
  return getTimeZoneCached(opts?.locale)
}
