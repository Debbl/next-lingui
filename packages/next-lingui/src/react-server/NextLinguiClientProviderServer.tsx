import getLocale from '../server/react-server/getLocale'
import getMessages from '../server/react-server/getMessages'
import NextLinguiClientProvider from '../shared/NextLinguiClientProvider'
import type { NextLinguiClientProviderProps } from '../shared/NextLinguiClientProvider'

type Props = Omit<NextLinguiClientProviderProps, 'locale' | 'messages'> & {
  locale?: NextLinguiClientProviderProps['locale']
  messages?: NextLinguiClientProviderProps['messages']
}

export default async function NextLinguiClientProviderServer({
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
