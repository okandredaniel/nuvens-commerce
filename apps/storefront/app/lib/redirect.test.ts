import { describe, expect, it, vi } from 'vitest';

vi.mock('@shopify/remix-oxygen', () => {
  return {
    redirect: (u: string) => ({ __redirect: u }),
  };
});

async function importRedirect() {
  return await import('./redirect');
}

function capture(fn: () => void) {
  try {
    fn();
    return null;
  } catch (e: any) {
    return e?.__redirect ?? null;
  }
}

describe('redirectIfHandleIsLocalized', () => {
  it('does nothing when all handles match', async () => {
    const { redirectIfHandleIsLocalized } = await importRedirect();
    const req = new Request('http://localhost:3000/products/foo');
    const result = capture(() =>
      redirectIfHandleIsLocalized(req, { handle: 'foo', data: { handle: 'foo' } }),
    );
    expect(result).toBeNull();
  });

  it('redirects when a single handle is localized', async () => {
    const { redirectIfHandleIsLocalized } = await importRedirect();
    const req = new Request('http://localhost:3000/collections/sale?sort=best#top');
    const result = capture(() =>
      redirectIfHandleIsLocalized(req, { handle: 'sale', data: { handle: 'promocoes' } }),
    );
    expect(result).toBe('http://localhost:3000/collections/promocoes?sort=best#top');
  });

  it('replaces multiple localized handles in the path', async () => {
    const { redirectIfHandleIsLocalized } = await importRedirect();
    const req = new Request('http://example.com/a/b/c');
    const result = capture(() =>
      redirectIfHandleIsLocalized(
        req,
        { handle: 'a', data: { handle: 'x' } },
        { handle: 'b', data: { handle: 'y' } },
        { handle: 'noop', data: { handle: 'noop' } },
      ),
    );
    expect(result).toBe('http://example.com/x/y/c');
  });

  it('preserves query and hash across multiple replacements', async () => {
    const { redirectIfHandleIsLocalized } = await importRedirect();
    const req = new Request('https://shop.test/a/b?q=1#frag');
    const result = capture(() =>
      redirectIfHandleIsLocalized(
        req,
        { handle: 'a', data: { handle: 'aa' } },
        { handle: 'b', data: { handle: 'bb' } },
      ),
    );
    expect(result).toBe('https://shop.test/aa/bb?q=1#frag');
  });
});
