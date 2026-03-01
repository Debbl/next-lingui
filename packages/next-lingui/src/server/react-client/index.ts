import type { getRequestConfig as getRequestConfigType } from '../react-server/index'

function notSupported(message: string) {
  return () => {
    throw new Error(`\`${message}\` is not supported in Client Components.`)
  }
}

export function getRequestConfig(
  // eslint-disable-next-line unused-imports/no-unused-vars
  ...args: Parameters<typeof getRequestConfigType>
): ReturnType<typeof getRequestConfigType> {
  return notSupported('getRequestConfig')
}
