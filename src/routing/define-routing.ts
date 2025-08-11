import type { LocalePrefix, LocalePrefixMode, Locales } from './types'

export interface RoutingConfig<
  AppLocales extends Locales,
  AppLocalePrefixMode extends LocalePrefixMode,
> {
  /**
   * All available locales.
   * @see https://next-intl.dev/docs/routing
   */
  locales: AppLocales

  /**
   * Used when no locale matches.
   * @see https://next-intl.dev/docs/routing
   */
  defaultLocale: AppLocales[number]

  /**
   * Configures whether and which prefix is shown for a given locale.
   * @see https://next-intl.dev/docs/routing#locale-prefix
   */
  localePrefix?: LocalePrefix<AppLocales, AppLocalePrefixMode>
}

export function defineRouting<
  AppLocales extends Locales,
  AppLocalePrefixMode extends LocalePrefixMode,
>(config: RoutingConfig<AppLocales, AppLocalePrefixMode>) {
  return config
}
