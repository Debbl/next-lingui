import getServerFormatter from '../server/react-server/getServerFormatter.js';
import useConfig from './useConfig.js';

export default function useFormatter() {
  const config = useConfig('useFormatter');
  return getServerFormatter(config);
}
