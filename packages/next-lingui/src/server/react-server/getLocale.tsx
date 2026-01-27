import {cache} from 'react';
import type {Locale} from '../../shared/types.js';
import getConfig from './getConfig.js';

async function getLocaleCachedImpl(): Promise<Locale> {
  const config = await getConfig();
  return config.locale;
}
const getLocaleCached = cache(getLocaleCachedImpl);

export default getLocaleCached;
