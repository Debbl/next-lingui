// Type helpers

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type ParametersExceptFirst<F> = F extends (
  arg0: any,
  ...rest: infer R
) => any
  ? R
  : never
