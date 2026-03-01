import type {
  GetRequestConfigParams,
  RequestConfig,
} from '../src/server/react-server/getRequestConfig'

export default async function getRuntimeConfig(
  params: GetRequestConfigParams,
): Promise<RequestConfig> {
  return {
    locale: (await params.requestLocale) || 'en',
    messages: {},
  }
}
