import { describe, expect, it, vi } from 'vitest'
import NextLinguiClientProvider from '../shared/NextLinguiClientProvider'
import NextLinguiClientProviderServer from './NextLinguiClientProviderServer'

vi.mock('../server/react-server/getLocale', () => ({
  default: vi.fn(async () => 'en-US'),
}))
vi.mock('../server/react-server/getMessages', () => ({
  default: vi.fn(async () => ({})),
}))

describe('nextLinguiClientProviderServer', () => {
  it('passes explicit locale and messages', async () => {
    const result = await NextLinguiClientProviderServer({
      locale: 'de-DE',
      messages: { hello: 'Hallo' },
      children: null,
    })

    expect(result.type).toBe(NextLinguiClientProvider)
    expect(result.props.locale).toBe('de-DE')
    expect(result.props.messages).toEqual({ hello: 'Hallo' })
  })

  it('falls back to request config values', async () => {
    const result = await NextLinguiClientProviderServer({ children: null })

    expect(result.type).toBe(NextLinguiClientProvider)
    expect(result.props.locale).toBe('en-US')
    expect(result.props.messages).toEqual({})
  })
})
