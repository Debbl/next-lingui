// eslint-disable-next-line import/no-extraneous-dependencies
import { type UserConfig,defineConfig} from 'tsdown';

const entry = {
  'index.react-server': 'src/index.react-server.tsx',
  'navigation.react-client': 'src/navigation.react-client.tsx',
  'navigation.react-server': 'src/navigation.react-server.tsx',
  'server.react-client': 'src/server.react-client.tsx',
  'server.react-server': 'src/server.react-server.tsx',
  middleware: 'src/middleware.tsx',
  routing: 'src/routing.tsx',
  plugin: 'src/plugin.tsx'
};

// eslint-disable-next-line func-style
const rewriteNextJsSuffix: any = () => ({
    name: 'rewrite-next-js-suffix',
    generateBundle(_options: any, bundle: any) {
      for (const chunk of Object.values(bundle) as Array<any>) {
        if (chunk.type !== 'chunk') continue;
        chunk.code = chunk.code.replace(
          /(['"])next\/(link|navigation|server)\.js\1/g,
          '$1next/$2$1'
        );
      }
    }
  })

// eslint-disable-next-line func-style
const ensureInternalRequestConfigExternal: UserConfig['inputOptions'] = (
  options
) => {
  const id = 'next-lingui/_internal/request-config';
  if (typeof options.external === 'function') {
    const external = options.external;
    options.external = (...args) => args[0] === id || external(...args);
    return options;
  }

  const list = Array.isArray(options.external)
    ? [...options.external]
    : options.external
      ? [options.external]
      : [];

  if (!list.includes(id)) {
    list.push(id);
  }
  options.external = list;
  return options;
};

export default defineConfig([
  {
    entry,
    format: 'esm',
    outDir: 'dist',
    unbundle: true,
    minify: true,
    env: {
      NODE_ENV: 'production'
    },
    fixedExtension: false,
    dts: false,
    inputOptions :ensureInternalRequestConfigExternal,
    plugins: [rewriteNextJsSuffix()]
  },
  {
    entry,
    format: 'esm',
    outDir: 'dist',
    unbundle: true,
    fixedExtension: false,
    tsconfig: 'tsconfig.build.json',
    dts: {
      emitDtsOnly: true,
      resolver: 'tsc'
    },
    inputOptions :ensureInternalRequestConfigExternal,
  }
]);
