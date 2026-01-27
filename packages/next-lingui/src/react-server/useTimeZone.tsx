import useConfig from './useConfig.js';

export default function useTimeZone(): string | undefined {
  const config = useConfig('useTimeZone');
  return config.timeZone;
}
