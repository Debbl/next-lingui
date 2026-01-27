import type {Locale} from '../shared/types.js';
import useConfig from './useConfig.js';

export default function useLocale(): Locale {
  const config = useConfig('useLocale');
  return config.locale;
}
