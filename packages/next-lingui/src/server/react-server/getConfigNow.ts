import { cache } from 'react'
import getConfig from './getConfig'
import type { Locale } from '../../shared/types'

async function getConfigNowImpl(locale?: Locale) {
  const config = await getConfig(locale)
  return config.now
}
const getConfigNow = cache(getConfigNowImpl)

export default getConfigNow
