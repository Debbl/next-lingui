// eslint-disable-next-line n/prefer-global/process
export const NODE_ENV = process.env.NODE_ENV

export const isProduction = NODE_ENV === 'production'
