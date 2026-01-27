/**
 * This is the main entry file when 'react-server' environments
 * (i.e. RSC) import from 'next-intl'. Currently we export everything
 * from Lingui core with compatibility wrappers.
 *
 * Make sure this mirrors the API from '../react-client'.
 */

// Replaced exports from the `react` package
export {default as useLocale} from './useLocale.js';
export {default as useTranslations} from './useTranslations.js';
export {default as useFormatter} from './useFormatter.js';
export {default as useNow} from './useNow.js';
export {default as useTimeZone} from './useTimeZone.js';
export {default as useMessages} from './useMessages.js';
export {default as NextIntlClientProvider} from './NextIntlClientProviderServer.js';
export {default as useExtracted} from './useExtracted.js';

// Re-export types
export type {Locale, Messages, LinguiConfig} from '../shared/types.js';
