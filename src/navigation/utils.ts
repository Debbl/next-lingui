import type { LinkProps } from 'next/link'

type Href = LinkProps['href']

function isRelativeHref(href: Href) {
  const pathname = typeof href === 'object' ? href.pathname : href
  return pathname != null && !pathname.startsWith('/')
}

function isLocalHref(href: Href) {
  if (typeof href === 'object') {
    return href.host == null && href.hostname == null
  } else {
    const hasProtocol = /^[a-z]+:/i.test(href)
    return !hasProtocol
  }
}

export function isLocalizableHref(href: Href) {
  return isLocalHref(href) && !isRelativeHref(href)
}
