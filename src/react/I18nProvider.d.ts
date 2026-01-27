import React from 'react';
import type { I18n } from '@lingui/core';
import type { ComponentType } from 'react';
import type { TransRenderProps } from './TransNoContext';
export interface I18nContext {
    i18n: I18n;
    _: I18n['_'];
    defaultComponent?: ComponentType<TransRenderProps>;
}
export type I18nProviderProps = Omit<I18nContext, '_'> & {
    children?: React.ReactNode;
};
export declare const LinguiContext: React.Context<I18nContext | null>;
export declare const useLinguiInternal: (devErrorMessage?: string) => I18nContext;
export declare function useLingui(): I18nContext;
export declare function I18nProvider({ i18n, defaultComponent, children, }: I18nProviderProps): import("react/jsx-runtime").JSX.Element | null;
