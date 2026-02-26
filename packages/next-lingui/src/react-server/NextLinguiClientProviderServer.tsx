import type {ComponentProps} from 'react';
import {getLocale, getMessages} from '../server.react-server.js';
import BaseNextLinguiClientProvider from '../shared/NextLinguiClientProvider.js';

type Props = ComponentProps<typeof BaseNextLinguiClientProvider>;

export default async function NextLinguiClientProviderServer({
  locale,
  messages,
  ...rest
}: Props) {
  return (
    <BaseNextLinguiClientProvider
      // We need to be careful about potentially reading from headers here.
      // See https://github.com/amannn/next-lingui/issues/631
      locale={locale ?? (await getLocale())}
      messages={messages === undefined ? await getMessages() : messages}
      {...rest}
    />
  );
}
