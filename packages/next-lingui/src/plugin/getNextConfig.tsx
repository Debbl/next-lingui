import fs from 'fs';
import path from 'path';
import type {NextConfig} from 'next';
import {hasStableTurboConfig} from './nextFlags.js';
import type {PluginConfig} from './types.js';
import {throwError} from './utils.js';

function withExtensions(localPath: string) {
  return [
    `${localPath}.ts`,
    `${localPath}.tsx`,
    `${localPath}.js`,
    `${localPath}.jsx`
  ];
}

function resolvePath(pathname: string, cwd?: string) {
  const parts = [];
  if (cwd) parts.push(cwd);
  parts.push(pathname);
  return path.resolve(...parts);
}

function pathExists(pathname: string, cwd?: string) {
  return fs.existsSync(resolvePath(pathname, cwd));
}

function resolveRequestConfigPath(providedPath?: string, cwd?: string) {
  if (providedPath) {
    if (!pathExists(providedPath, cwd)) {
      throwError(
        `Could not find request config at ${providedPath}, please provide a valid path.`
      );
    }
    return providedPath;
  }

  for (const candidate of [
    ...withExtensions('./i18n/request'),
    ...withExtensions('./src/i18n/request')
  ]) {
    if (pathExists(candidate, cwd)) {
      return candidate;
    }
  }

  throwError(
    `Could not locate request configuration module.\n\nSupported defaults:\n- ./(src/)i18n/request.{js,jsx,ts,tsx}\n\nOr specify it explicitly in your Next.js config:\n\nconst withNextLingui = createNextLinguiPlugin('./path/to/i18n/request.ts');`
  );
}

function resolveLinguiConfigPath(providedPath?: string, cwd?: string) {
  const candidates = [
    './lingui.config.ts',
    './lingui.config.js',
    './lingui.config.mjs',
    './lingui.config.cjs',
    './src/lingui.config.ts',
    './src/lingui.config.js',
    './src/lingui.config.mjs',
    './src/lingui.config.cjs'
  ];

  if (providedPath) {
    if (!pathExists(providedPath, cwd)) {
      throwError(
        `Could not find Lingui config at ${providedPath}, please provide a valid path.`
      );
    }
    return providedPath;
  }

  for (const candidate of candidates) {
    if (pathExists(candidate, cwd)) {
      return candidate;
    }
  }

  return undefined;
}

function withLinguiSwcPlugin(
  swcPlugins: Array<[string, Record<string, unknown>]> | undefined,
  swcPluginOptions?: Record<string, unknown>
) {
  const normalized = [...(swcPlugins ?? [])];
  const hasLinguiPlugin = normalized.some(
    (entry) => Array.isArray(entry) && entry[0] === '@lingui/swc-plugin'
  );

  if (!hasLinguiPlugin) {
    normalized.unshift(['@lingui/swc-plugin', swcPluginOptions ?? {}]);
  }

  return normalized;
}

export default function getNextConfig(
  pluginConfig: PluginConfig,
  nextConfig?: NextConfig
) {
  const useTurbo = process.env.TURBOPACK != null;
  const nextLinguiConfig: Partial<NextConfig> = {};

  const linguiConfigPath = resolveLinguiConfigPath(pluginConfig.linguiConfigPath);

  if (useTurbo) {
    if (
      pluginConfig.requestConfig &&
      path.isAbsolute(pluginConfig.requestConfig)
    ) {
      throwError(
        "Turbopack support for next-lingui does not support absolute paths for `requestConfig`. Please provide a relative path like './src/i18n/request.ts'."
      );
    }

    const resolveAlias = {
      // Turbo aliases don't work with absolute paths
      'next-lingui/config': resolveRequestConfigPath(pluginConfig.requestConfig)
    };

    if (
      hasStableTurboConfig() &&
      // @ts-expect-error -- For Next.js <16
      !nextConfig?.experimental?.turbo
    ) {
      nextLinguiConfig.turbopack = {
        ...nextConfig?.turbopack,
        resolveAlias: {
          ...nextConfig?.turbopack?.resolveAlias,
          ...resolveAlias
        }
      };
    } else {
      nextLinguiConfig.experimental = {
        ...nextConfig?.experimental,
        // @ts-expect-error -- For Next.js <16
        turbo: {
          // @ts-expect-error -- For Next.js <16
          ...nextConfig?.experimental?.turbo,
          resolveAlias: {
            // @ts-expect-error -- For Next.js <16
            ...nextConfig?.experimental?.turbo?.resolveAlias,
            ...resolveAlias
          }
        }
      };
    }
  } else {
    nextLinguiConfig.webpack = function webpack(config, context) {
      if (!config.resolve) config.resolve = {};
      if (!config.resolve.alias) config.resolve.alias = {};

      // Assign alias for `next-lingui/config` (Webpack requires absolute paths)
      (config.resolve.alias as Record<string, string>)['next-lingui/config'] =
        path.resolve(
          config.context!,
          resolveRequestConfigPath(pluginConfig.requestConfig, config.context)
        );

      if (typeof nextConfig?.webpack === 'function') {
        return nextConfig.webpack(config, context);
      }

      return config;
    };
  }

  const swcPlugins = withLinguiSwcPlugin(
    (nextConfig?.experimental?.swcPlugins as
      | Array<[string, Record<string, unknown>]>
      | undefined) ?? undefined,
    pluginConfig.swcPluginOptions
  );

  nextLinguiConfig.experimental = {
    ...nextConfig?.experimental,
    ...nextLinguiConfig.experimental,
    swcPlugins
  };

  nextLinguiConfig.env = {
    ...nextConfig?.env,
    ...nextLinguiConfig.env,
    ...(linguiConfigPath
      ? {
          _next_lingui_config_path: path.resolve(
            process.cwd(),
            linguiConfigPath
          )
        }
      : undefined),
    ...(nextConfig?.trailingSlash
      ? {
          _next_lingui_trailing_slash: 'true'
        }
      : undefined)
  };

  return Object.assign({}, nextConfig, nextLinguiConfig);
}
