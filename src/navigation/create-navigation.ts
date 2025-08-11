import { useLingui } from '@lingui/react'
import NextLink from 'next/link'
import {
  redirect as nextRedirect,
  usePathname as useNextPathname,
  useRouter as useNextRouter,
} from 'next/navigation'
import { createElement, forwardRef, useCallback, useMemo } from 'react'
import { isLocalizableHref } from './utils'
import type { ComponentProps } from 'react'
import type { RoutingConfig } from '~/routing'
import type { LocalePrefixMode, Locales } from '~/routing/types'

export function createNavigation<
  const AppLocales extends Locales,
  const AppLocalePrefixMode extends LocalePrefixMode = 'always',
>(routing: RoutingConfig<AppLocales, AppLocalePrefixMode>) {
  const { locales } = routing

  const getPathname = ({ href, locale }: { locale: string; href: string }) => {
    const hasLocale = locales.some((locale) => href?.startsWith(`/${locale}`))

    if (hasLocale) {
      return href
    }

    return `/${locale}${href}`
  }

  const Link = (
    { href, ...rest }: ComponentProps<typeof NextLink>,
    ref: ComponentProps<typeof NextLink>['ref'],
  ) => {
    const isUrlObject = typeof href === 'object'

    const pathname = isUrlObject ? href.pathname! : href

    const isLocalizable = isLocalizableHref(href)

    const {
      i18n: { locale },
    } = useLingui()

    const finalPathname = isLocalizable
      ? getPathname({ locale, href: pathname })
      : pathname

    return createElement(NextLink, {
      href: isUrlObject ? { ...href, pathname: finalPathname } : finalPathname,
      ...rest,
      ref,
    })
  }

  const usePathname = () => {
    const pathname = useNextPathname()

    const locale = locales.find((locale) => pathname?.startsWith(`/${locale}`))
    return locale ? pathname.slice(locale.length + 1) : pathname
  }

  const useRouter = () => {
    const router = useNextRouter()
    const {
      i18n: { locale },
    } = useLingui()

    const createHandler = useCallback(
      <Options, Fn extends (href: string, options?: Options) => void>(fn: Fn) =>
        (href: string, options?: Partial<Options> & { locale?: string }) => {
          const { locale: nextLocale, ...rest } = options || {}

          const pathname = getPathname({
            locale: nextLocale || locale,
            href,
          })
          const args: [href: string, options?: Options] = [pathname]
          if (Object.keys(rest).length > 0) {
            // @ts-expect-error -- This is fine
            args.push(rest)
          }

          fn(...args)
        },
      [locale],
    )

    return useMemo(() => {
      return {
        ...router,
        push: createHandler<
          Parameters<typeof router.push>[1],
          typeof router.push
        >(router.push),
        replace: createHandler<
          Parameters<typeof router.replace>[1],
          typeof router.replace
        >(router.replace),
        prefetch: createHandler<
          Parameters<typeof router.prefetch>[1],
          typeof router.prefetch
        >(router.prefetch),
      }
    }, [router, createHandler])
  }

  const redirect = ({ href, locale }: { href: string; locale: string }) => {
    const hasLocale = locales.some((locale) => href.startsWith(`/${locale}`))
    const finalHref = hasLocale ? href : `/${locale}${href}`

    nextRedirect(finalHref)
  }

  return {
    ...routing,
    redirect,
    Link: forwardRef(Link),
    usePathname,
    useRouter,
  }
}
