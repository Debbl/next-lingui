import getRuntimeConfig from 'next-lingui/_internal/request-config';
import type {
  GetRequestConfigParams,
  RequestConfig
} from './getRequestConfig.js';

export default getRuntimeConfig as unknown as (
  params: GetRequestConfigParams
) => RequestConfig | Promise<RequestConfig>;
