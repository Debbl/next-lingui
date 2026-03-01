'use client'
import { Trans } from '@lingui/react/macro'
import { ThemeSwitcher } from '~/components/theme-switcher'
import Counter from '../components/counter'
import NavigationHooksDemo from '../components/navigation-hooks-demo'

export default function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-center gap-y-4'>
      <Counter />
      <NavigationHooksDemo />

      <ThemeSwitcher />
      <Trans>hi</Trans>
      <Trans>hello</Trans>
    </main>
  )
}
