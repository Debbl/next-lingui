import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function createMiddleware({
  locales,
  sourceLocale,
}: {
  locales: string[]
  sourceLocale: string
}) {
  return (request: NextRequest) => {
    const { pathname } = request.nextUrl

    const pathnameHasLocale = locales.some(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    )
    if (pathnameHasLocale) return

    request.nextUrl.pathname = `/${sourceLocale}${request.nextUrl.pathname}`

    return NextResponse.rewrite(request.nextUrl)
  }
}
