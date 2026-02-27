import type {ComponentProps} from 'react';
import getLocale from '../server/react-server/getLocale.js';
import getMessages from '../server/react-server/getMessages.js';
import NextLinguiClientProvider from '../shared/NextLinguiClientProvider.js';

type Props = Omit<ComponentProps<typeof NextLinguiClientProvider>, 'locale' | 'messages'> & {
  locale?: ComponentProps<typeof NextLinguiClientProvider>['locale'];
  messages?: ComponentProps<typeof NextLinguiClientProvider>['messages'];
};

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
  );
}
