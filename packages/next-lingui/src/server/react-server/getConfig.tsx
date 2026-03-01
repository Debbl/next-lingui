/* eslint-disable n/prefer-global/process */
import { cache } from 'react'
import { isPromise } from '../../shared/utils'
import createRequestConfig from './createRequestConfig'
import { getRequestLocale } from './RequestLocale'
import validateLocale from './validateLocale'
import type { LinguiConfig, Locale } from '../../shared/types'
import type { GetRequestConfigParams } from './getRequestConfig'

// This is automatically inherited by `NextLinguiClientProvider` if
// the component is rendered from a Server Component.
function getDefaultTimeZoneImpl() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
const getDefaultTimeZone = cache(getDefaultTimeZoneImpl)

async function receiveRuntimeConfigImpl(
  getConfig: typeof createRequestConfig,
  localeOverride?: Locale,
) {
  if (
    process.env.NODE_ENV !== 'production' &&
    typeof getConfig !== 'function'
  ) {
    throw new Error(
      `Invalid i18n request configuration detected.

Please verify that:
1. In case you've specified a custom location in your Next.js config, make sure that the path is correct.
2. You have a default export in your i18n request configuration file.

See also: https://next-lingui.dev/docs/usage/configuration#i18n-request
`,
    )
  }

  const params: GetRequestConfigParams = {
    locale: localeOverride,

    // In case the consumer doesn't read `params.locale` and instead provides the
    // `locale` (either in a single-language workflow or because the locale is
    // read from the user settings), don't attempt to read the request locale.
    get requestLocale() {
      return localeOverride
        ? Promise.resolve(localeOverride)
        : getRequestLocale()
    },
  }

  let result = getConfig(params)
  if (isPromise(result)) {
    result = await result
  }

  if (!result.locale) {
    throw new Error(
      'No locale was returned from `getRequestConfig`.\n\nSee https://next-lingui.dev/docs/usage/configuration#i18n-request',
    )
  }
  if (process.env.NODE_ENV !== 'production') {
    validateLocale(result.locale)
  }

  return result
}
const receiveRuntimeConfig = cache(receiveRuntimeConfigImpl)

function initializeLinguiConfig(config: LinguiConfig): LinguiConfig {
  return {
    locale: config.locale,
    messages: config.messages,
    now: config.now,
    timeZone: config.timeZone,
    formats: config.formats,
    onError:
      config.onError ||
      ((error) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error)
        }
      }),
    getMessageFallback: config.getMessageFallback || (({ id }) => id),
  }
}

async function getConfigImpl(localeOverride?: Locale): Promise<LinguiConfig> {
  const runtimeConfig = await receiveRuntimeConfig(
    createRequestConfig,
    localeOverride,
  )

  const initializedConfig = initializeLinguiConfig(runtimeConfig)

  return {
    ...initializedConfig,
    timeZone: runtimeConfig.timeZone || getDefaultTimeZone(),
  }
}
const getConfig = cache(getConfigImpl)
export default getConfig
