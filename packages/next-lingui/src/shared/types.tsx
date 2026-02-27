import type {I18n} from '@lingui/core';

export type ParametersExceptFirst<Fn> = Fn extends (
  arg0: any,
  ...rest: infer R
) => any
  ? R
  : never;

export type ParametersExceptFirstTwo<Fn> = Fn extends (
  arg0: any,
  arg1: any,
  ...rest: infer R
) => any
  ? R
  : never;

// https://www.totaltypescript.com/concepts/the-prettify-helper
export type Prettify<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};

// Lingui-compatible types
export type Locale = string;
// Allow both string and CompiledMessage types for compatibility with Lingui
export type Messages = Record<string, string | any>;

// Lingui config interface
export interface LinguiConfig {
  locale: Locale;
  messages: Messages;
  now?: Date;
  timeZone?: string;
  formats?: Record<string, any>;
  onError?(error: Error): void;
  getMessageFallback?(info: {id: string; locale: Locale}): string;
}

// Translation function type
export type TranslationFn = I18n['_'];

// Re-export for compatibility with existing code
export type {I18n} from '@lingui/core';
