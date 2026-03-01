import fs from 'node:fs'
import path from 'node:path'
import { hasStableTurboConfig, isNextJs16OrHigher } from './nextFlags'
import { throwError } from './utils'
import type { NextConfig } from 'next'
import type { PluginConfig } from './types'

const REQUEST_CONFIG_ALIAS = 'next-lingui/_internal/request-config'

function withExtensions(localPath: string) {
  return [
    `${localPath}.ts`,
    `${localPath}.tsx`,
    `${localPath}.js`,
    `${localPath}.jsx`,
  ]
}

function resolvePath(pathname: string, cwd?: string) {
  const parts = []
  if (cwd) parts.push(cwd)
  parts.push(pathname)
  return path.resolve(...parts)
}

function pathExists(pathname: string, cwd?: string) {
  return fs.existsSync(resolvePath(pathname, cwd))
}

function resolveRequestConfigPath(providedPath?: string, cwd?: string) {
  if (providedPath) {
    if (!pathExists(providedPath, cwd)) {
      throwError(
        `Could not find request config at ${providedPath}, please provide a valid path.`,
      )
    }
    return providedPath
  }

  for (const candidate of [
    ...withExtensions('./i18n/request'),
    ...withExtensions('./src/i18n/request'),
  ]) {
    if (pathExists(candidate, cwd)) {
      return candidate
    }
  }

  throwError(
    `Could not locate request configuration module.\n\nSupported defaults:\n- ./(src/)i18n/request.{js,jsx,ts,tsx}\n\nOr specify it explicitly in your Next.js config:\n\nconst withNextLingui = createNextLinguiPlugin('./path/to/i18n/request.ts');`,
  )
}

export default function getNextConfig(
  pluginConfig: PluginConfig,
  nextConfig?: NextConfig,
) {
  const nextLinguiConfig: Partial<NextConfig> = {}

  const shouldConfigureTurbo =
    // eslint-disable-next-line n/prefer-global/process
    process.env.TURBOPACK != null ||
    isNextJs16OrHigher() ||
    nextConfig?.turbopack != null ||
    // @ts-expect-error -- For Next.js <16
    nextConfig?.experimental?.turbo != null

  if (shouldConfigureTurbo) {
    if (
      pluginConfig.requestConfig &&
      path.isAbsolute(pluginConfig.requestConfig)
    ) {
      throwError(
        "Turbopack support for next-lingui does not support absolute paths for `requestConfig`. Please provide a relative path like './src/i18n/request.ts'.",
      )
    }

    const resolveAlias = {
      [REQUEST_CONFIG_ALIAS]: resolveRequestConfigPath(
        pluginConfig.requestConfig,
      ),
    }

    if (
      hasStableTurboConfig() &&
      // @ts-expect-error -- For Next.js <16
      !nextConfig?.experimental?.turbo
    ) {
      nextLinguiConfig.turbopack = {
        ...nextConfig?.turbopack,
        resolveAlias: {
          ...nextConfig?.turbopack?.resolveAlias,
          ...resolveAlias,
        },
      }
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
            ...resolveAlias,
          },
        },
      }
    }
  }

  nextLinguiConfig.webpack = function webpack(config, context) {
    if (!config.resolve) config.resolve = {}
    if (!config.resolve.alias) config.resolve.alias = {}
    ;(config.resolve.alias as Record<string, string>)[REQUEST_CONFIG_ALIAS] =
      path.resolve(
        config.context!,
        resolveRequestConfigPath(pluginConfig.requestConfig, config.context),
      )

    if (typeof nextConfig?.webpack === 'function') {
      return nextConfig.webpack(config, context)
    }

    return config
  }

  return Object.assign({}, nextConfig, nextLinguiConfig)
}
