import {setupI18n} from '@lingui/core';
import {cache} from 'react';
import type {LinguiConfig} from '../../shared/types.js';

function getServerTranslatorImpl(
  config: LinguiConfig,
  namespace?: string
) {
  // Create a Lingui i18n instance
  const i18n = setupI18n({
    locale: config.locale,
    messages: {
      [config.locale]: config.messages
    }
  });
  
  // Return a translation function compatible with use-intl's API
  // If namespace is provided, prefix all keys with namespace
  return (id: string, values?: Record<string, any>) => {
    const messageId = namespace ? `${namespace}.${id}` : id;
    return i18n._(messageId, values);
  };
}

export default cache(getServerTranslatorImpl);
