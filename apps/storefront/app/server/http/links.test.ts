import { describe, expect, it, vi } from 'vitest';

vi.mock('@/assets/favicon.svg?url', () => ({ default: '/test-favicon.svg' }));
vi.mock('@nuvens/brand-ui/styles.css?url', () => ({ default: '/brand-ui.css' }));

import { links } from './links';

describe('links module', () => {
  it('returns favicon and stylesheet link descriptors', () => {
    const out = links();
    expect(out).toEqual([
      { rel: 'icon', type: 'image/svg+xml', href: '/test-favicon.svg' },
      { rel: 'stylesheet', href: '/brand-ui.css' },
    ]);
  });
});
