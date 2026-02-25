'use client'
import { Trans } from 'next-lingui/react/macro'
import { ThemeSwitcher } from '~/components/theme-switcher'
import Counter from '../components/counter'

export default function Home() {
  return (
    <main className='flex h-full flex-col items-center justify-center gap-y-4'>
      <Counter />

      <ThemeSwitcher />
      <Trans>hi</Trans>
      <Trans>hello</Trans>
    </main>
  )
}
