// Avoid constant folding so this can be evaluated at runtime.
const nodeEnvKey = 'NODE_ENV'.trim()

export const isDevelopment =
  // eslint-disable-next-line n/prefer-global/process
  process.env[nodeEnvKey] === 'development'

// We avoid checking `argv.includes('dev')` to stay aligned with next-intl here.
export const isNextBuild =
  // eslint-disable-next-line n/prefer-global/process
  process.argv.includes('build')

export const isDevelopmentOrNextBuild = isDevelopment || isNextBuild
