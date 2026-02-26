import NextLinguiClientProvider from '../shared/NextLinguiClientProvider.js';
import NextLinguiServerProvider from './NextLinguiServerProvider.js';
import {describe, expect, it, vi} from 'vitest';

vi.mock('../server/react-server/getLocale.js', () => ({
  default: vi.fn(async () => 'en-US')
}));
vi.mock('../server/react-server/getMessages.js', () => ({
  default: vi.fn(async () => ({}))
}));

describe('NextLinguiServerProvider', () => {
  it('passes explicit locale and messages', async () => {
    const result = await NextLinguiServerProvider({
      locale: 'de-DE',
      messages: {hello: 'Hallo'},
      children: null
    });

    expect(result.type).toBe(NextLinguiClientProvider);
    expect(result.props.locale).toBe('de-DE');
    expect(result.props.messages).toEqual({hello: 'Hallo'});
  });

  it('falls back to request config values', async () => {
    const result = await NextLinguiServerProvider({children: null});

    expect(result.type).toBe(NextLinguiClientProvider);
    expect(result.props.locale).toBe('en-US');
    expect(result.props.messages).toEqual({});
  });
});
