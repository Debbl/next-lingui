import bundleAnalyzer from '@next/bundle-analyzer'
import createNextLinguiPlugin from 'next-lingui/plugin'
import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line n/prefer-global/process
  enabled: process.env.ANALYZE === 'true',
})

const withNextLingui = createNextLinguiPlugin({
  requestConfig: './src/i18n/requests.ts',
  linguiConfigPath: './lingui.config.ts',
})

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
}

export default [withBundleAnalyzer, withNextLingui].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
)
