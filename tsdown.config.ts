import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    middleware: 'src/middleware/index.ts',
    routing: 'src/routing/index.ts',
  },
  sourcemap: true,
  dts: { sourcemap: true },
  exports: {
    devExports: true,
  },
})
