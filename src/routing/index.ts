export interface RoutingConfig {
  locales: string[]
  defaultLocale: string
}

export function defineRouting(config: RoutingConfig) {
  return config
}
