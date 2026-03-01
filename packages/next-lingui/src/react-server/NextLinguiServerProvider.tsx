import getLocale from '../server/react-server/getLocale'
import getMessages from '../server/react-server/getMessages'
import NextLinguiClientProvider from '../shared/NextLinguiClientProvider'
import type { ComponentProps } from 'react'

type Props = Omit<
  ComponentProps<typeof NextLinguiClientProvider>,
  'locale' | 'messages'
> & {
  locale?: ComponentProps<typeof NextLinguiClientProvider>['locale']
  messages?: ComponentProps<typeof NextLinguiClientProvider>['messages']
}

export default async function NextLinguiServerProvider({
  locale,
  messages,
  ...rest
}: Props) {
  return (
    <NextLinguiClientProvider
      locale={locale ?? (await getLocale())}
      messages={messages === undefined ? await getMessages() : messages}
      {...rest}
    />
  )
}
