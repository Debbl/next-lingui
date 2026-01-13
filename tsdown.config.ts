import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'routing': 'src/routing/index.ts',
    'plugin': 'src/plugin/index.ts',
    'middleware': 'src/middleware/index.ts',
    'index.react-client': 'src/index.client.ts',
    'index.react-server': 'src/index.server.ts',
    'server/react-client': 'src/server/react-client/index.ts',
    'server/react-server': 'src/server/react-server/index.ts',
  },
  sourcemap: true,
  fixedExtension: false,
  dts: { sourcemap: true },
})
