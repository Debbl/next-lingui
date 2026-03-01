import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'

const entry = {
  'index.react-client': 'src/index.react-client.ts',
  'index.react-server': 'src/index.react-server.ts',
  'navigation.react-client': 'src/navigation.react-client.ts',
  'navigation.react-server': 'src/navigation.react-server.ts',
  'server.react-client': 'src/server.react-client.ts',
  'server.react-server': 'src/server.react-server.ts',
  'middleware': 'src/middleware.ts',
  'routing': 'src/routing.ts',
  'plugin': 'src/plugin.ts',
}

const preserveUseClientDirectives: any = () => ({
  name: 'preserve-use-client-directives',
  generateBundle(_options: any, bundle: any) {
    const clientModuleSuffixes = [
      '/src/shared/NextLinguiClientProvider.tsx',
      '/src/navigation/shared/BaseLink.tsx',
    ]

    for (const chunk of Object.values(bundle) as Array<any>) {
      if (chunk.type !== 'chunk') continue

      const moduleIds = [
        ...(Array.isArray(chunk.moduleIds) ? chunk.moduleIds : []),
        ...Object.keys(chunk.modules ?? {}),
      ].map((id) => id.replaceAll('\\', '/'))

      const isClientChunk = moduleIds.some((id) =>
        clientModuleSuffixes.some((suffix) => id.endsWith(suffix)),
      )
      if (!isClientChunk) continue

      if (!/['"]use client['"]\s*;/.test(chunk.code)) {
        chunk.code = `'use client';\n${chunk.code}`
      }
    }
  },
})

const ensureInternalRequestConfigExternal: UserConfig['inputOptions'] = (
  options,
) => {
  const id = 'next-lingui/_internal/request-config'
  if (typeof options.external === 'function') {
    const external = options.external
    options.external = (...args) => args[0] === id || external(...args)
    return options
  }

  const list = Array.isArray(options.external)
    ? [...options.external]
    : options.external
      ? [options.external]
      : []

  if (!list.includes(id)) {
    list.push(id)
  }
  options.external = list
  return options
}

export default defineConfig([
  {
    entry,
    format: 'esm',
    env: {
      NODE_ENV: 'production',
    },
    dts: true,
    sourcemap: true,
    inputOptions: ensureInternalRequestConfigExternal,
    plugins: [preserveUseClientDirectives()],
  },
])
