'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { useLocale } from '~/hooks/use-locale'
import syncLocaleCookie from './sync-locale-cookie'
import type { Locale } from '@lingui/core'
import type { LinkProps } from 'next/link'
import type { ComponentProps, MouseEvent, ReactNode, Ref } from 'react'
import type { InitializedLocaleCookieConfig } from '~/routing/config'

type NextLinkProps = Omit<ComponentProps<'a'>, keyof LinkProps> &
  Omit<LinkProps, 'locale'>

type Props = NextLinkProps & {
  locale?: Locale
  localeCookie: InitializedLocaleCookieConfig
}

function BaseLink(
  { href, locale, localeCookie, onClick, prefetch, ...rest }: Props,
  ref: Ref<HTMLAnchorElement>,
) {
  const curLocale = useLocale()
  const isChangingLocale = locale != null && locale !== curLocale

  // The types aren't entirely correct here. Outside of Next.js
  // `useParams` can be called, but the return type is `null`.
  const pathname = usePathname() as ReturnType<typeof usePathname> | null

  function onLinkClick(event: MouseEvent<HTMLAnchorElement>) {
    syncLocaleCookie(localeCookie, pathname, curLocale, locale)
    if (onClick) onClick(event)
  }

  if (isChangingLocale) {
    // eslint-disable-next-line n/prefer-global/process
    if (prefetch && process.env.NODE_ENV !== 'production') {
      console.error(
        'The `prefetch` prop is currently not supported when using the `locale` prop on `Link` to switch the locale.`',
      )
    }
    prefetch = false
  }

  // Somehow the types for `next/link` don't work as expected
  // when `moduleResolution: "nodenext"` is used.
  const Link = NextLink as unknown as (props: NextLinkProps) => ReactNode

  return (
    <Link
      ref={ref}
      href={href}
      hrefLang={isChangingLocale ? locale : undefined}
      onClick={onLinkClick}
      prefetch={prefetch}
      {...rest}
    />
  )
}

export default forwardRef(BaseLink)
