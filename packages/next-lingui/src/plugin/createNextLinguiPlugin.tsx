import getNextConfig from './getNextConfig'
import type { NextConfig } from 'next'
import type { PluginConfig } from './types'

export default function createNextLinguiPlugin(
  requestConfigPathOrConfig: string | PluginConfig = {},
) {
  const config =
    typeof requestConfigPathOrConfig === 'string'
      ? { requestConfig: requestConfigPathOrConfig }
      : requestConfigPathOrConfig

  return function withNextLingui(nextConfig?: NextConfig) {
    return getNextConfig(config, nextConfig)
  }
}
