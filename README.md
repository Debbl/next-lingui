# next-lingui

A minimal Next.js compatibility layer for [js-lingui](https://github.com/lingui/js-lingui).

It is intentionally small: `next-lingui` does not try to replace Lingui itself, but provides a few Next.js-oriented pieces so you can integrate js-lingui into a Next.js app more easily.

## Supported APIs

Only a small compatibility surface is provided:

- `next-lingui`
  - `NextLinguiClientProvider`
- `next-lingui/middleware`
  - `createMiddleware` (default export)
- `next-lingui/plugin`
  - `createNextLinguiPlugin` (default export, `requestConfig` only)
- `next-lingui/navigation`
  - `createNavigation`
- `next-lingui/routing`
  - `defineRouting`
- `next-lingui/server`
  - `getRequestConfig`

## Breaking Changes

Removed exports and subpaths:

- Hooks from `next-lingui`:
  - `useLocale`
  - `useTranslations`
  - `useFormatter`
  - `useNow`
  - `useTimeZone`
  - `useMessages`
- APIs from `next-lingui/server`:
  - `getTranslations`
  - `getLocale`
  - `getMessages`
  - `getFormatter`
  - `getNow`
  - `getTimeZone`
  - `setRequestLocale`
- Removed subpaths:
  - `next-lingui/react/macro`
  - `next-lingui/conf`
  - `next-lingui/extractor`
  - `next-lingui/config`
- Removed CLI wrapper:
  - `next-lingui extract`
  - `next-lingui compile`

## Migration

- Macro imports: use `@lingui/react/macro` directly.
- Lingui config helper: use `defineConfig` from `@lingui/conf`.
- Catalog workflows: use official `lingui` CLI (`lingui extract`, `lingui compile`).
- Automatic server-side locale/messages injection: use `NextLinguiClientProvider`.
- Explicit provider mode: use `NextLinguiClientProvider` with required `locale` and `messages`.

## Credits

- [js-lingui](https://github.com/lingui/js-lingui)
- [next-intl](https://github.com/amannn/next-intl)
