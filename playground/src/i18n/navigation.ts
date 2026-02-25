import { createNavigation } from 'next-lingui/navigation'
import { routing } from './routing'

export const {
  Link,
  redirect,
  permanentRedirect,
  usePathname,
  useRouter,
  getPathname,
} = createNavigation(routing)
