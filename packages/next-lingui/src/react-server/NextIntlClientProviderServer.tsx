import type {ComponentProps} from 'react';
import {getLocale, getMessages} from '../server.react-server.js';
import BaseNextIntlClientProvider from '../shared/NextLinguiClientProvider.js';

type Props = ComponentProps<typeof BaseNextIntlClientProvider>;

export default async function NextIntlClientProviderServer({
  locale,
  messages,
  ...rest
}: Props) {
  return (
    <BaseNextIntlClientProvider
      // We need to be careful about potentially reading from headers here.
      // See https://github.com/amannn/next-intl/issues/631
      locale={locale ?? (await getLocale())}
      messages={messages === undefined ? await getMessages() : messages}
      {...rest}
    />
  );
}
