import type { I18n } from '@lingui/core'
import React, {type  ComponentType } from 'react'

export interface I18nContext {
  i18n: I18n
  _: I18n['_']
  defaultComponent?: ComponentType<any>
}

export type I18nProviderProps = Omit<I18nContext, '_'> & {
  children?: React.ReactNode
}

export const LinguiContext = React.createContext<I18nContext | null>(null)

export function useLinguiInternal (devErrorMessage?: string): I18nContext {
  const context = React.useContext(LinguiContext)

  // Always throw if context is null, not just in development
  // This ensures consistent behavior across all environments
  if (context == null) {
    throw new Error(
      devErrorMessage ?? 'useLingui hook was used without I18nProvider.',
    )
  }

  return context
}

export function useLingui(): I18nContext {
  return useLinguiInternal()
}

export function I18nProvider({
  children,
  defaultComponent,
  i18n,
}: I18nProviderProps) {
  /**
   * We can't pass `i18n` object directly through context, because even when locale
   * or messages are changed, i18n object is still the same. Context provider compares
   * reference identity and suggested workaround is to create a wrapper object every time
   * we need to trigger re-render. See https://reactjs.org/docs/context.html#caveats.
   *
   * Due to this effect we also pass `defaultComponent` in the same context, instead
   * of creating a separate Provider/Consumer pair.
   *
   * We can't use useMemo hook either, because we want to recalculate value manually.
   */
  const makeContext = React.useCallback(
    () => ({
      i18n,
      defaultComponent,
      _: i18n.t.bind(i18n),
    }),
    [i18n, defaultComponent],
  )

  const [context, setContext] = React.useState<I18nContext>(makeContext())

  /**
   * Subscribe for locale/message changes
   *
   * I18n object from `@lingui/core` is the single source of truth for all i18n related
   * data (active locale, catalogs). When new messages are loaded or locale is changed
   * we need to trigger re-rendering of LinguiContext.Consumers.
   */
  React.useEffect(() => {
    function updateContext() {
      setContext(makeContext())
    }
    const unsubscribe = i18n.on('change', updateContext)

    return unsubscribe
  }, [i18n, makeContext])

  // Always render, the i18n instance should be activated before passing to the provider
  return (
    <LinguiContext.Provider value={context}>{children}</LinguiContext.Provider>
  )
}
