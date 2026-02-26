import type {NextConfig} from 'next';
import getNextConfig from './getNextConfig.js';
import type {PluginConfig} from './types.js';

export default function createNextLinguiPlugin(
  requestConfigPathOrConfig: string | PluginConfig = {}
) {
  const config =
    typeof requestConfigPathOrConfig === 'string'
      ? {requestConfig: requestConfigPathOrConfig}
      : requestConfigPathOrConfig;

  return function withNextLingui(nextConfig?: NextConfig) {
    return getNextConfig(config, nextConfig);
  };
}
