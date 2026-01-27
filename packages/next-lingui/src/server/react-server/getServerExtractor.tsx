import {cache} from 'react';
import type {LinguiConfig} from '../../shared/types.js';
import getServerTranslator from './getServerTranslator.js';

// Note: This API is usually compiled into `useTranslations`,
// but there is some fallback handling which allows this hook
// to still work when not being compiled.
//
// This is relevant for:
// - Isolated environments like tests, Storybook, etc.
// - Fallbacks in case an extracted message is not yet available
function getServerExtractorImpl(
  config: LinguiConfig,
  namespace?: string
) {
  const t = getServerTranslator(config, namespace);

  // For Lingui, the extractor just returns the translator
  // as Lingui handles extraction differently through its CLI
  return t;
}

export default cache(getServerExtractorImpl);
