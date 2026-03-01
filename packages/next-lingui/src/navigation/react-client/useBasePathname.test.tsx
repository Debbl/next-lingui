import { useLingui } from '@lingui/react'
import { render, screen } from '@testing-library/react'
import { usePathname as useNextPathname } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useBasePathname from './useBasePathname'

vi.mock('next/navigation')
vi.mock('@lingui/react', () => ({
  useLingui: vi.fn(() => ({ i18n: { locale: 'en' } })),
}))

function mockPathname(pathname: string) {
  vi.mocked(useNextPathname).mockImplementation(() => pathname)
}

function mockLocale(locale: string) {
  vi.mocked(useLingui).mockReturnValue({ i18n: { locale } } as any)
}

function Component() {
  return useBasePathname({
    localePrefix: {
      mode: 'as-needed',
    },
  })
}

function renderComponent(pathname: string, locale = 'en') {
  mockLocale(locale)
  mockPathname(pathname)
  render(<Component />)
}

describe('unprefixed routing', () => {
  it('returns an unprefixed pathname', () => {
    renderComponent('/')
    screen.getByText('/')
  })

  it('returns an unprefixed pathname at sub paths', () => {
    renderComponent('/about')
    screen.getByText('/about')
  })
})

describe('prefixed routing', () => {
  it('returns an unprefixed pathname', () => {
    renderComponent('/en')
    screen.getByText('/')
  })

  it('returns an unprefixed pathname at sub paths', () => {
    renderComponent('/en/about')
    screen.getByText('/about')
  })
})

describe('usage outside of Next.js', () => {
  beforeEach(() => {
    vi.mocked(useNextPathname).mockImplementation((() => null) as any)
  })

  it('returns `null` when used in a non-Next.js environment', () => {
    mockLocale('en')
    const { container } = render(<Component />)
    expect(container.innerHTML).toBe('')
  })
})
