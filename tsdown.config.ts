import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
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
  hooks: {
    'build:done': async ({ options }) => {
      const outDir = options.outDir
      const cwd = options.cwd
      const macroDir = path.join(cwd, 'src/macro')
      const macroOutDir = path.join(outDir, 'macro')

      await mkdir(macroOutDir, { recursive: true })

      await writeFile(
        path.join(macroOutDir, 'index.d.ts'),
        await readFile(path.join(macroDir, 'index.d.ts'), 'utf-8'),
      )
      await writeFile(
        path.join(macroOutDir, 'index.js'),
        await readFile(path.join(macroDir, 'index.js'), 'utf-8'),
      )
    },
  },
})
