import { warn } from './utils'
import getNextConfig from './getNextConfig'
import type { NextConfig } from 'next'
import type { PluginConfig } from './types'

function initPlugin(pluginConfig: PluginConfig, nextConfig?: NextConfig) {
  if (nextConfig?.i18n != null) {
    warn(
      "An `i18n` property was found in your Next.js config. This can conflict with the App Router integration and should be removed unless you're still migrating from the Pages Router.\n",
    )
  }

  return getNextConfig(pluginConfig, nextConfig)
}

export default function createNextLinguiPlugin(
  requestConfigPathOrConfig: string | PluginConfig = {},
) {
  const config =
    typeof requestConfigPathOrConfig === 'string'
      ? { requestConfig: requestConfigPathOrConfig }
      : requestConfigPathOrConfig

  return function withNextLingui(nextConfig?: NextConfig) {
    return initPlugin(config, nextConfig)
  }
}
