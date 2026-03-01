import type {
  GetRequestConfigParams,
  RequestConfig,
} from '../dist/server/react-server/getRequestConfig'

declare const getRuntimeConfig: (
  params: GetRequestConfigParams,
) => RequestConfig | Promise<RequestConfig>

export default getRuntimeConfig
