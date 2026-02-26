import {expect, it, vi} from 'vitest';
import {getLocale, getMessages} from '../server.react-server.js';
import NextLinguiClientProvider from '../shared/NextLinguiClientProvider.js';
import NextLinguiClientProviderServer from './NextLinguiClientProviderServer.js';

vi.mock('../../src/server/react-server', async () => ({
  getLocale: vi.fn(async () => 'en-US'),
  getMessages: vi.fn(async () => ({}))
}));

vi.mock('../../src/shared/NextLinguiClientProvider', async () => ({
  default: vi.fn(() => 'NextLinguiClientProvider')
}));

it("doesn't read from headers if all relevant configuration is passed", async () => {
  const result = await NextLinguiClientProviderServer({
    children: null,
    locale: 'en-GB',
    messages: {}
  });

  expect(result.type).toBe(NextLinguiClientProvider);
  expect(result.props).toEqual({
    children: null,
    locale: 'en-GB',
    messages: {}
  });

  expect(getLocale).not.toHaveBeenCalled();
  expect(getMessages).not.toHaveBeenCalled();
});

it('reads missing configuration from getter functions', async () => {
  const result = await NextLinguiClientProviderServer({
    children: null
  });

  expect(result.type).toBe(NextLinguiClientProvider);
  expect(result.props).toEqual({
    children: null,
    locale: 'en-US',
    messages: {}
  });

  expect(getLocale).toHaveBeenCalled();
  expect(getMessages).toHaveBeenCalled();
});
