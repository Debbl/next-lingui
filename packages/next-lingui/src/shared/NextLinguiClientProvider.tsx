'use client';

import {setupI18n} from '@lingui/core';
import {type ReactNode, useEffect, useState} from 'react';
import {I18nProvider} from './LinguiProvider.js';
import type {Locale, Messages} from './types.js';

type Props = {
  /** This is automatically received when being rendered from a Server Component. In all other cases, e.g. when rendered from a Client Component, a unit test or with the Pages Router, you can pass this prop explicitly. */
  locale?: Locale;
  messages?: Messages;
  children?: ReactNode;
};

export default function NextLinguiClientProvider({children, locale, messages}: Props) {
  if (!locale) {
    throw new Error(
      process.env.NODE_ENV !== 'production'
        ? "Couldn't infer the `locale` prop in `NextIntlClientProvider`, please provide it explicitly.\n\nSee https://next-lingui.dev/docs/configuration#locale"
        : undefined
    );
  }

  // Initialize i18n instance once with useState to avoid re-creation
  const [i18n] = useState(() => {
    const instance = setupI18n({
      locale,
      messages: {
        [locale]: messages || {}
      }
    });
    // Activate the locale immediately
    if (messages) {
      instance.load(locale, messages);
      instance.activate(locale);
    }
    return instance;
  });

  // Update locale and messages when they change
  useEffect(() => {
    if (messages) {
      i18n.load(locale, messages);
      if (i18n.locale !== locale) {
        i18n.activate(locale);
      }
    }
  }, [i18n, locale, messages]);

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>;
}
