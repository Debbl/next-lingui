import {cache} from 'react';
import type {Locale, Messages} from '../../shared/types.js';
import getConfig from './getConfig.js';

export function getMessagesFromConfig(
  config: Awaited<ReturnType<typeof getConfig>>
): Messages {
  if (!config.messages) {
    throw new Error(
      'No messages found. Have you configured them correctly? See https://next-lingui.dev/docs/configuration#messages'
    );
  }
  return config.messages;
}

async function getMessagesCachedImpl(locale?: Locale) {
  const config = await getConfig(locale);
  return getMessagesFromConfig(config);
}
const getMessagesCached = cache(getMessagesCachedImpl);

export default async function getMessages(opts?: {
  locale?: Locale;
}): Promise<Messages> {
  return getMessagesCached(opts?.locale);
}
