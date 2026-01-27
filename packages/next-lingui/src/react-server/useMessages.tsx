import {getMessagesFromConfig} from '../server/react-server/getMessages.js';
import type {Messages} from '../shared/types.js';
import useConfig from './useConfig.js';

export default function useMessages(): Messages {
  const config = useConfig('useMessages');
  return getMessagesFromConfig(config);
}
