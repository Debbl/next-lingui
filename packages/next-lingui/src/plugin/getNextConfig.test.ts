import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { NextConfig } from 'next'

const VALID_REQUEST_CONFIG = './packages/next-lingui/test/request-config.ts'
const originalArgv = [...process.argv]
const originalEnv = { ...process.env }

async function importGetNextConfig() {
  vi.resetModules()
  return (await import('./getNextConfig')).default
}

async function importCreateNextLinguiPlugin() {
  vi.resetModules()
  return (await import('./createNextLinguiPlugin')).default
}

beforeEach(() => {
  vi.restoreAllMocks()
  process.argv = [...originalArgv]
  Object.assign(process.env, originalEnv)
  delete process.env.TURBOPACK
  Object.assign(process.env, { NODE_ENV: 'test' })
})

afterEach(() => {
  process.argv = [...originalArgv]
  Object.keys(process.env).forEach((key) => {
    if (!(key in originalEnv)) {
      delete process.env[key]
    }
  })
  Object.assign(process.env, originalEnv)
})

describe('getNextConfig', () => {
  it('does not throw for a missing request config outside of dev/build flows', async () => {
    Object.assign(process.env, { NODE_ENV: 'production' })
    process.argv = ['/usr/bin/node', 'vitest']

    const getNextConfig = await importGetNextConfig()

    expect(() =>
      getNextConfig({ requestConfig: './does-not-exist.ts' }),
    ).not.toThrow()
  })

  it('forwards trailingSlash to the runtime env', async () => {
    const getNextConfig = await importGetNextConfig()

    const nextConfig: NextConfig = {
      trailingSlash: true,
    }

    expect(
      getNextConfig({ requestConfig: VALID_REQUEST_CONFIG }, nextConfig).env,
    ).toMatchObject({
      _next_intl_trailing_slash: 'true',
    })
  })

  it('skips webpack wiring when Turbopack is active', async () => {
    process.env.TURBOPACK = '1'

    const getNextConfig = await importGetNextConfig()
    const config = getNextConfig({ requestConfig: VALID_REQUEST_CONFIG })

    expect(config.turbopack).toBeDefined()
    expect(config.webpack).toBeUndefined()
  })
})

describe('createNextLinguiPlugin', () => {
  it('warns when the Next.js i18n config is still present', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const createNextLinguiPlugin = await importCreateNextLinguiPlugin()

    createNextLinguiPlugin({
      requestConfig: VALID_REQUEST_CONFIG,
    })({
      i18n: {
        locales: ['en'],
        defaultLocale: 'en',
      },
    })

    expect(warnSpy).toHaveBeenCalledTimes(1)
    expect(warnSpy.mock.calls[0]?.[0]).toContain('[next-lingui]')
    expect(warnSpy.mock.calls[0]?.[0]).toContain('`i18n` property')
  })
})
