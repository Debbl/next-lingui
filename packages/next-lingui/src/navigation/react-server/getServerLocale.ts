import getConfig from '../../server/react-server/getConfig'

/**
 * This is only moved to a separate module for easier mocking in
 * `../createNavigatoin.test.ts` in order to avoid suspending.
 */
export default async function getServerLocale() {
  const config = await getConfig()
  return config.locale
}
