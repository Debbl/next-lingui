import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    middleware: 'src/middleware/index.ts',
    routing: 'src/routing/index.ts',
    navigation: 'src/navigation/index.ts',
    cli: 'src/cli/index.ts',
    hooks: 'src/hooks/index.ts',
  },
  sourcemap: true,
  dts: { sourcemap: true },
})
