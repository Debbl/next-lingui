import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  // eslint-disable-next-line n/prefer-global/process
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  output: 'export',
  reactCompiler: true,
}

export default [withBundleAnalyzer].reduce(
  (config, withFn) => withFn(config),
  nextConfig,
)
