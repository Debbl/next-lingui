'use client'
import { useLingui } from '@lingui/react'
import { Button } from '~/components/ui/button'
import { usePathname, useRouter } from '~/i18n/navigation'
import { routing } from '~/i18n/routing'

export default function NavigationHooksDemo() {
  const pathname = usePathname()
  const router = useRouter()
  const { i18n } = useLingui()
  const locale = i18n.locale
  const localeIndex = routing.locales.indexOf(
    locale as (typeof routing.locales)[number],
  )
  const nextLocale =
    localeIndex >= 0
      ? routing.locales[(localeIndex + 1) % routing.locales.length]
      : routing.defaultLocale
  const targetPathname = pathname || '/'

  return (
    <section className='flex w-full max-w-md flex-col gap-y-3 rounded-lg border border-black/10 p-4'>
      <p className='text-sm font-medium'>usePathname: {targetPathname}</p>
      <p className='text-sm text-black/70'>current locale: {locale}</p>

      <div className='flex gap-x-2'>
        <Button
          type='button'
          variant='outline'
          onClick={() => {
            router.replace(targetPathname, { locale: nextLocale })
          }}
        >
          useRouter.replace -&gt; {nextLocale}
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={() => {
            router.push(targetPathname)
          }}
        >
          useRouter.push
        </Button>
      </div>
    </section>
  )
}
