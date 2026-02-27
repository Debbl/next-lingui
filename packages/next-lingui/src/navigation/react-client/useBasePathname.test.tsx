import {render, screen} from '@testing-library/react';
import {usePathname as useNextPathname} from 'next/navigation.js';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {NextLinguiClientProvider} from '../../index.react-client.js';
import useBasePathname from './useBasePathname.js';

vi.mock('next/navigation.js');

function mockPathname(pathname: string) {
  vi.mocked(useNextPathname).mockImplementation(() => pathname);
}

function Component() {
  return useBasePathname({
    localePrefix: {
      mode: 'as-needed'
    }
  });
}

function renderWithProvider(pathname: string) {
  mockPathname(pathname);
  render(
    <NextLinguiClientProvider locale="en" messages={{}}>
      <Component />
    </NextLinguiClientProvider>
  );
}

describe('unprefixed routing', () => {
  it('returns an unprefixed pathname', () => {
    renderWithProvider('/');
    screen.getByText('/');
  });

  it('returns an unprefixed pathname at sub paths', () => {
    renderWithProvider('/about');
    screen.getByText('/about');
  });
});

describe('prefixed routing', () => {
  it('returns an unprefixed pathname', () => {
    renderWithProvider('/en');
    screen.getByText('/');
  });

  it('returns an unprefixed pathname at sub paths', () => {
    renderWithProvider('/en/about');
    screen.getByText('/about');
  });
});

describe('usage outside of Next.js', () => {
  beforeEach(() => {
    vi.mocked(useNextPathname).mockImplementation((() => null) as any);
  });

  it('returns `null` when used within a provider', () => {
    const {container} = render(
      <NextLinguiClientProvider locale="en" messages={{}}>
        <Component />
      </NextLinguiClientProvider>
    );
    expect(container.innerHTML).toBe('');
  });
});
