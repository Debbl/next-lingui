import {describe, expect, it} from 'vitest';
import {getRequestConfig} from './index.js';

describe('server index', () => {
  it('exports getRequestConfig', () => {
    const fn = getRequestConfig(async ({requestLocale}) => ({
      locale: (await requestLocale) || 'en',
      messages: {}
    }));

    expect(typeof fn).toBe('function');
  });
});
