import { defineConfig } from 'next-lingui/conf'

export default defineConfig({
  locales: ['en', 'zh'],
  sourceLocale: 'en',
  compileNamespace: 'json',
  macro: {
    jsxPackage: ['next-lingui/react/macro'],
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
})
