function formatMessage(message: string) {
  return `\n[next-lingui] ${message}\n`
}

export function throwError(message: string): never {
  throw new Error(formatMessage(message))
}

export function warn(message: string) {
  console.warn(formatMessage(message))
}

/**
 * Returns a function that runs the provided callback only once per process.
 * Next.js can call the config multiple times - this ensures we only run once.
 * Uses an environment variable to track execution across config loads.
 */
export function once(namespace: string) {
  return function runOnce(fn: () => void) {
    // eslint-disable-next-line n/prefer-global/process
    if (process.env[namespace] === '1') {
      return
    }
    // eslint-disable-next-line n/prefer-global/process
    process.env[namespace] = '1'
    fn()
  }
}
