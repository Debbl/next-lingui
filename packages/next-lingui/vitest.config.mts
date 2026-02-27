import {defineConfig} from 'vitest/config';
import {fileURLToPath} from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      'next-lingui/_internal/request-config': fileURLToPath(
        new URL('./test/request-config.ts', import.meta.url)
      )
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './test/setup.tsx'
  }
});
