import type { NextConfig } from 'next'

export function createNextLinguiPlugin() {
  return (config: NextConfig) => {
    return config
  }
}
