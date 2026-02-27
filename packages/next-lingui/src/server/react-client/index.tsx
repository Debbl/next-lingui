import type {getRequestConfig as getRequestConfigType} from '../react-server/index.js';

function notSupported(message: string) {
  return () => {
    throw new Error(`\`${message}\` is not supported in Client Components.`);
  };
}

export function getRequestConfig(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...args: Parameters<typeof getRequestConfigType>
): ReturnType<typeof getRequestConfigType> {
  return notSupported('getRequestConfig');
}
