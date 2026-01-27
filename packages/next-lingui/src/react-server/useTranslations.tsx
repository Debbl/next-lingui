import getServerTranslator from '../server/react-server/getServerTranslator.js';
import useConfig from './useConfig.js';

type TranslationFn = (id: string, values?: Record<string, any>) => string;

export default function useTranslations(namespace?: string): TranslationFn {
  const config = useConfig('useTranslations');
  return getServerTranslator(config, namespace);
}
