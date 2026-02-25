import type {NextConfig} from 'next';
import createMessagesDeclaration from './declaration/index.js';
import getNextConfig from './getNextConfig.js';
import type {PluginConfig} from './types.js';
import {throwError, warn} from './utils.js';

function initPlugin(
  pluginConfig: PluginConfig,
  nextConfig?: NextConfig
): NextConfig {
  if (nextConfig?.i18n != null) {
    warn(
      "An `i18n` property was found in your Next.js config. This can conflict with App Router based i18n and should be removed when using next-lingui."
    );
  }

  if (pluginConfig.experimental != null) {
    throwError(
      "`experimental` plugin options are removed. Use top-level `linguiConfigPath`, `requestConfig`, `createMessagesDeclaration` and `swcPluginOptions` instead."
    );
  }

  const messagesPathOrPaths = pluginConfig.createMessagesDeclaration;
  if (messagesPathOrPaths) {
    createMessagesDeclaration(
      typeof messagesPathOrPaths === 'string'
        ? [messagesPathOrPaths]
        : messagesPathOrPaths
    );
  }

  return getNextConfig(pluginConfig, nextConfig);
}

export default function createNextLinguiPlugin(
  requestConfigPathOrConfig: string | PluginConfig = {}
) {
  const config =
    typeof requestConfigPathOrConfig === 'string'
      ? {requestConfig: requestConfigPathOrConfig}
      : requestConfigPathOrConfig;

  return function withNextLingui(nextConfig?: NextConfig) {
    return initPlugin(config, nextConfig);
  };
}
