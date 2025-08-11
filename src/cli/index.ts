import { defineConfig as defineConfigLingui } from '@lingui/conf'
import type { LinguiConfig } from '@lingui/conf'
import type { RoutingConfig } from '~/routing/define-routing'

export function defineConfig(
  config: Omit<LinguiConfig, 'locales'> & {
    routing: RoutingConfig<any, any>
  },
) {
  return defineConfigLingui({
    ...config,
    locales: config.routing.locales,
  })
}
