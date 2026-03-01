declare module 'next-lingui/_internal/request-config' {
  import type {
    GetRequestConfigParams,
    RequestConfig,
  } from './server/react-server/getRequestConfig'

  const getRuntimeConfig: (
    params: GetRequestConfigParams,
  ) => RequestConfig | Promise<RequestConfig>

  export default getRuntimeConfig
}
