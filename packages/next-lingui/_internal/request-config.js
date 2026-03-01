export default function getRuntimeConfig() {
  throw new Error(
    '[next-lingui] Missing runtime request config alias. ' +
      'Use next-lingui/plugin in your Next.js config so ' +
      "'next-lingui/_internal/request-config' is aliased.",
  )
}
