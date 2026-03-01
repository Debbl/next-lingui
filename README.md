# next-lingui

A minimal Next.js integration layer for [Lingui](https://github.com/lingui/js-lingui).

## Supported APIs

Only these APIs are part of the public surface:

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
