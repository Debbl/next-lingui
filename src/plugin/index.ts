import { readFileSync, writeFileSync } from 'node:fs'
import { getCatalogs, getFormat } from '@lingui/cli/api'
import type {
  CatalogFormat,
  CatalogFormatter,
  LinguiConfig,
} from '@lingui/conf'
import type { NextConfig } from 'next'

let hasExtracted = false

async function extractMessages(config: LinguiConfig) {
  // Only extract once per session
  if (hasExtracted) {
    return
  }

  hasExtracted = true
  const startTime = Date.now()

  console.warn('[next-lingui] Starting message extraction...')

  try {
    // Normalize the config using getConfig
    // @ts-expect-error - getConfig has complex overloads

    // Get all catalogs (returns Promise)
    const catalogs: any[] = await getCatalogs(config)

    // Get format handler (returns Promise)
    const format: any = await getFormat(
      config.format as CatalogFormat | CatalogFormatter,
      config.formatOptions || {},
      config.sourceLocale || 'en',
    )

    let totalMessages = 0

    // Process each catalog
    for (const catalog of catalogs) {
      const catalogMessages: Record<string, any> = {}

      // Read existing catalog if exists
      try {
        const content = readFileSync(catalog.path, 'utf-8')
        const existing = await format.parse(content, {
          locale: catalog.locale || catalog.locales?.[0],
          sourceLocale: config.sourceLocale,
          filename: catalog.path,
        })
        Object.assign(catalogMessages, existing)
      } catch {
        // File doesn't exist yet, that's ok
      }

      // Collect messages from catalog
      const messages = catalog.makeTemplate?.() || {}
      const messageCount = Object.keys(messages).length

      // Merge messages
      for (const [id, msg] of Object.entries(messages)) {
        if (typeof msg === 'object' && msg !== null) {
          catalogMessages[id] = {
            ...catalogMessages[id],
            ...(msg as any),
            translation: catalogMessages[id]?.translation || '',
          }
        }
      }

      // Write catalog
      const output = await format.serialize(catalogMessages, {
        locale: catalog.locale || catalog.locales?.[0],
        sourceLocale: config.sourceLocale,
        filename: catalog.path,
        existing: null,
      })
      writeFileSync(catalog.path, output, 'utf-8')

      totalMessages += messageCount
      console.warn(
        `[next-lingui] ✓ ${catalog.locale || catalog.locales?.[0]}: ${messageCount} messages`,
      )
    }

    const duration = Date.now() - startTime
    console.warn(
      `[next-lingui] Message extraction completed in ${duration}ms (${totalMessages} total)`,
    )
  } catch (error) {
    console.error('[next-lingui] Message extraction error:', error)
  }
}

export function createNextLinguiPlugin(linguiConfig: LinguiConfig) {
  // Run extraction asynchronously when plugin is created
  extractMessages(linguiConfig).catch((error) => {
    console.error('[next-lingui] Failed to extract messages:', error)
  })

  return (nextConfig: NextConfig) => {
    return {
      ...nextConfig,
      experimental: {
        ...nextConfig.experimental,
        swcPlugins: [
          ['@lingui/swc-plugin', {}],
          ...(nextConfig.experimental?.swcPlugins ?? []),
        ],
      },
    } satisfies NextConfig
  }
}
