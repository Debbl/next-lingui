import { defineConfig } from '@lingui/conf'

export default defineConfig({
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  compileNamespace: 'json',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
})
