import { cache } from 'react'
import getConfig from './getConfig'
import getServerTranslator from './getServerTranslator'
import type { Locale } from '../../shared/types'

// Maintainer note: `getTranslations` has two different call signatures.
// We need to define these with function overloads, otherwise TypeScript
// messes up the return type.

// Translation function type
type TranslationFn = (id: string, values?: Record<string, any>) => string

// Call signature 1: `getTranslations(namespace)`
function getTranslations(namespace?: string): Promise<TranslationFn>
// Call signature 2: `getTranslations({locale, namespace})`
function getTranslations(opts?: {
  locale: Locale
  namespace?: string
}): Promise<TranslationFn>
// Implementation
async function getTranslations(
  namespaceOrOpts?: string | { locale: Locale; namespace?: string },
) {
  let namespace: string | undefined
  let locale: Locale | undefined

  if (typeof namespaceOrOpts === 'string') {
    namespace = namespaceOrOpts
  } else if (namespaceOrOpts) {
    locale = namespaceOrOpts.locale
    namespace = namespaceOrOpts.namespace
  }

  const config = await getConfig(locale)
  return getServerTranslator(config, namespace)
}

export default cache(getTranslations)
