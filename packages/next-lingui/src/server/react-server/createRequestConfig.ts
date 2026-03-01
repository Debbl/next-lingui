import getRuntimeConfig from 'next-lingui/_internal/request-config'
import type { GetRequestConfigParams, RequestConfig } from './getRequestConfig'

export default getRuntimeConfig as unknown as (
  params: GetRequestConfigParams,
) => RequestConfig | Promise<RequestConfig>
