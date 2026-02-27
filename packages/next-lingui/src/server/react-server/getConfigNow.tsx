import {cache} from 'react';
import type {Locale} from '../../shared/types.js';
import getConfig from './getConfig.js';

async function getConfigNowImpl(locale?: Locale) {
  const config = await getConfig(locale);
  return config.now;
}
const getConfigNow = cache(getConfigNowImpl);

export default getConfigNow;
