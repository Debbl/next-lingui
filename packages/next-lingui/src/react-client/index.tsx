/**
 * This is the main entry file when non-'react-server'
 * environments import from 'next-intl'.
 *
 * Maintainer notes:
 * - Make sure this mirrors the API from 'react-server'.
 * - Make sure everything exported from this module is
 *   supported in all Next.js versions that are supported.
 */

import {useLingui} from '../shared/LinguiProvider.js';

// Re-export types
export type {Locale, Messages, LinguiConfig} from '../shared/types.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function callHook(name: string, hook: Function) {
  return (...args: Array<unknown>) => {
    try {
      return hook(...args);
    } catch {
      throw new Error(
        process.env.NODE_ENV !== 'production'
          ? `Failed to call \`${name}\` because the context from \`NextIntlClientProvider\` was not found.

This can happen because:
1) You intended to render this component as a Server Component, the render
   failed, and therefore React attempted to render the component on the client
   instead. If this is the case, check the console for server errors.
2) You intended to render this component on the client side, but no context was found.
   Learn more about this error here: https://next-intl.dev/docs/environments/server-client-components#missing-context`
          : undefined
      );
    }
  };
}

// Hook to get locale from Lingui context
export function useLocale() {
  const {i18n} = useLingui();
  return i18n.locale;
}

// Hook to get messages from Lingui context
export function useMessages() {
  const {i18n} = useLingui();
  return i18n.messages;
}

// Hook to get now (current time)
export function useNow() {
  return new Date();
}

// Hook to get timezone
export function useTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Wrapper for useTranslations with error handling
function base_useTranslations(namespace?: string) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {i18n} = useLingui();
  return (id: string, values?: Record<string, any>) => {
    const messageId = namespace ? `${namespace}.${id}` : id;
    return i18n._(messageId, values);
  };
}

export const useTranslations = callHook(
  'useTranslations',
  base_useTranslations
) as typeof base_useTranslations;

// Lingui doesn't have a separate formatter hook - formatting is built into translation
// For compatibility, we provide a basic formatter that uses Intl APIs
export function useFormatter() {
  const locale = useLocale();
  
  return {
    dateTime: (date: Date | number, options?: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, options).format(date),
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options).format(value),
    relativeTime: (value: number, unit: Intl.RelativeTimeFormatUnit, options?: Intl.RelativeTimeFormatOptions) => new Intl.RelativeTimeFormat(locale, options).format(value, unit)
  };
}

export {default as NextLinguiClientProvider} from '../shared/NextLinguiClientProvider.js';
