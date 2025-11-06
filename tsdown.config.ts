import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'plugin': 'src/plugin/index.ts',
    'index.react-client': 'src/index.client.ts',
    'index.react-server': 'src/index.server.ts',
    'server/react-client': 'src/server/react-client/index.ts',
    'server/react-server': 'src/server/react-server/index.ts',
  },
  sourcemap: true,
  fixedExtension: false,
  dts: { sourcemap: true },
})
