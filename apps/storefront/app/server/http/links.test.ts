import { describe, expect, it, vi } from 'vitest';

vi.mock('./links', () => ({
  links: () => [
    { rel: 'icon', type: 'image/png', href: '/test-favicon.png' },
    { rel: 'stylesheet', href: '/brand-ui.css' },
  ],
}));

import { links } from './links';

describe('links module', () => {
  it('returns favicon and stylesheet link descriptors', () => {
    const out = links();
    expect(out).toEqual([
      { rel: 'icon', type: 'image/png', href: '/test-favicon.png' },
      { rel: 'stylesheet', href: '/brand-ui.css' },
    ]);
  });
});
