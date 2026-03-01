import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'next-lingui/_internal/request-config': fileURLToPath(
        new URL('./test/request-config.ts', import.meta.url),
      ),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
})
