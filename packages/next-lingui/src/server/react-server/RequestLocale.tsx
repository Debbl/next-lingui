import { headers } from 'next/headers'
import { cache } from 'react'
import { HEADER_LOCALE_NAME } from '../../shared/constants'
import { isPromise } from '../../shared/utils'
import { getCachedRequestLocale } from './RequestLocaleCache'
import type { Locale } from '../../shared/types'

async function getHeadersImpl(): Promise<Headers> {
  const promiseOrValue = headers()

  // Compatibility with Next.js <15
  return isPromise(promiseOrValue) ? await promiseOrValue : promiseOrValue
}
const getHeaders = cache(getHeadersImpl)

async function getLocaleFromHeaderImpl(): Promise<Locale | undefined> {
  let locale

  try {
    locale = (await getHeaders()).get(HEADER_LOCALE_NAME) || undefined
  } catch (error) {
    if (
      error instanceof Error &&
      (error as any).digest === 'DYNAMIC_SERVER_USAGE'
    ) {
      const wrappedError = new Error(
        'Usage of next-lingui APIs in Server Components currently opts into dynamic rendering. This limitation will eventually be lifted, but as a stopgap solution, you can use the `setRequestLocale` API to enable static rendering, see https://next-lingui.dev/docs/routing/setup#static-rendering',
        { cause: error },
      )
      ;(wrappedError as any).digest = (error as any).digest
      throw wrappedError
    } else {
      throw error
    }
  }

  return locale
}
const getLocaleFromHeader = cache(getLocaleFromHeaderImpl)

export async function getRequestLocale() {
  return getCachedRequestLocale() || (await getLocaleFromHeader())
}
