import { cache } from 'react'
import getConfig from './getConfig'
import type { Locale } from '../../shared/types'

async function getLocaleCachedImpl(): Promise<Locale> {
  const config = await getConfig()
  return config.locale
}
const getLocaleCached = cache(getLocaleCachedImpl)

export default getLocaleCached
