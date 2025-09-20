import { beforeEach, expect, it, vi } from 'vitest';

const setupBaseMocks = () => {
  vi.doMock('./core.adapter', () => ({ registerUiCoreAdapter: vi.fn() }));
  vi.doMock('./server/security/csp/policy', () => {
    const NonceProvider = ({ children }: any) => children;
    return { createHydrogenCSP: () => ({ nonce: 'nonce-x', header: 'csp-header', NonceProvider }) };
  });
  vi.doMock('./server/http/headers', () => ({
    applySecurityHeaders: (h: Headers, header: string) => {
      h.set('Content-Security-Policy', header);
    },
  }));
};

beforeEach(() => {
  vi.resetModules();
});

it('retorna 500 quando ocorre erro durante o render', async () => {
  setupBaseMocks();
  vi.doMock('isbot', () => ({ isbot: () => false }));
  vi.doMock('react-dom/server', () => ({
    renderToReadableStream: (_el: any, opts: any) => {
      opts.onError();
      const stream = new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('x'));
          c.close();
        },
      });
      (stream as any).allReady = Promise.resolve();
      return stream;
    },
  }));
  const mod = await import('./entry.server');
  const res = await mod.default(
    new Request('https://x/'),
    200,
    new Headers(),
    {} as any,
    {} as any,
  );
  expect(res.status).toBe(500);
  expect(res.headers.get('Content-Security-Policy')).toBe('csp-header');
});

it('aguarda allReady quando user-agent é bot', async () => {
  setupBaseMocks();
  let awaited = false;
  vi.doMock('isbot', () => ({ isbot: () => true }));
  vi.doMock('react-dom/server', () => ({
    renderToReadableStream: () => {
      const stream = new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('x'));
          c.close();
        },
      });
      (stream as any).allReady = new Promise((r) => {
        awaited = true;
        r(null);
      });
      return stream;
    },
  }));
  const mod = await import('./entry.server');
  await mod.default(new Request('https://x/'), 200, new Headers(), {} as any, {} as any);
  expect(awaited).toBe(true);
});

it('não aguarda allReady quando user-agent não é bot', async () => {
  setupBaseMocks();
  let awaited = false;
  vi.doMock('isbot', () => ({ isbot: () => false }));
  vi.doMock('react-dom/server', () => ({
    renderToReadableStream: () => {
      const stream = new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode('x'));
          c.close();
        },
      });
      (stream as any).allReady = {
        then: (resolve: any) => {
          awaited = true;
          resolve();
        },
      };
      return stream;
    },
  }));
  const mod = await import('./entry.server');
  await mod.default(new Request('https://x/'), 200, new Headers(), {} as any, {} as any);
  expect(awaited).toBe(false);
});
