import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'

const entry = {
  'index.react-server': 'src/index.react-server.tsx',
  'navigation.react-client': 'src/navigation.react-client.tsx',
  'navigation.react-server': 'src/navigation.react-server.tsx',
  'server.react-client': 'src/server.react-client.tsx',
  'server.react-server': 'src/server.react-server.tsx',
  'middleware': 'src/middleware.tsx',
  'routing': 'src/routing.tsx',
  'plugin': 'src/plugin.tsx',
}

const rewriteNextJsSuffix: any = () => ({
  name: 'rewrite-next-js-suffix',
  generateBundle(_options: any, bundle: any) {
    for (const chunk of Object.values(bundle) as Array<any>) {
      if (chunk.type !== 'chunk') continue
      chunk.code = chunk.code.replace(
        /(['"])next\/(link|navigation|server)\.js\1/g,
        '$1next/$2$1',
      )
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
    plugins: [rewriteNextJsSuffix()],
  },
])
