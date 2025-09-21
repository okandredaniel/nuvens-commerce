import * as Remix from '@shopify/remix-oxygen';
import { beforeEach, expect, test, vi } from 'vitest';

vi.mock('virtual:react-router/server-build', () => ({ default: {} }));

vi.mock('@/server/context', () => ({
  createAppLoadContext: vi.fn(),
}));

vi.mock('@/lib/routing/paths', () => ({
  resolvePolicyPath: vi.fn((p: string) => p),
}));

vi.mock('@nuvens/core', () => ({
  evaluateRouteAccess: vi.fn(() => ({ allowed: true })),
}));

vi.mock('@shopify/hydrogen', () => ({
  storefrontRedirect: vi.fn(({ response }: { response: Response }) => {
    const headers = new Headers([['X-Redirected', '1']]);
    return new Response('redirected', { status: response.status, headers });
  }),
}));

vi.mock('@shopify/remix-oxygen', () => {
  const createRequestHandler = vi.fn(() => async (req: Request) => {
    const url = new URL(req.url);
    const path = url.pathname;
    const isData =
      path.endsWith('.data') ||
      url.searchParams.has('_data') ||
      (req.headers.get('x-remix-data') || '').toLowerCase() === 'yes';

    if (isData) {
      if (path === '/_root.data') {
        const headers = new Headers([['Content-Type', 'application/json']]);
        return new Response(JSON.stringify({ path }), { status: 200, headers });
      }
      return new Response('', { status: 404 });
    }

    if (path === '/cause404') return new Response('', { status: 404 });

    const headers = new Headers([['Content-Type', 'application/json']]);
    return new Response(JSON.stringify({ path }), { status: 200, headers });
  });
  return { createRequestHandler };
});

vi.mock('./app/server/brand', () => ({
  getBrandContext: vi.fn(async () => ({ policy: null })),
}));

import * as Core from '@nuvens/core';
import { storefrontRedirect } from '@shopify/hydrogen';
import server from './server';

type ErrBody = { stage: string; name?: string; message?: string };

function req(u: string, h?: HeadersInit) {
  return new Request(u, { headers: h });
}

beforeEach(async () => {
  vi.clearAllMocks();
  const { createAppLoadContext } = await import('@/server/context');
  (createAppLoadContext as any).mockResolvedValue({
    storefront: {},
    session: { isPending: false, commit: vi.fn() },
  });
});

test('normalizes "/.data" to "/_root.data" before handling', async () => {
  const r = await server.fetch(
    req('http://localhost:3000/.data?_data=1', new Headers([['x-remix-data', 'yes']])),
    {} as any,
    {} as any,
  );
  const data = (await r.json()) as { path: string };
  expect(data.path).toBe('/_root.data');
});

test('returns storefrontRedirect when handler returns 404 for non-data', async () => {
  const r = await server.fetch(req('http://localhost:3000/cause404'), {} as any, {} as any);
  expect(r.headers.get('X-Redirected')).toBe('1');
  expect((storefrontRedirect as any).mock.calls.length).toBeGreaterThan(0);
});

test('does not redirect on 404 for data requests', async () => {
  const r = await server.fetch(
    req('http://localhost:3000/cause404.data?_data=1', new Headers([['x-remix-data', 'yes']])),
    {} as any,
    {} as any,
  );
  expect(r.status).toBe(404);
  expect((storefrontRedirect as any).mock.calls.length).toBe(0);
});

test('policy denies ".data" path and returns 404 without redirect', async () => {
  const Brand = await import('./app/server/brand');
  (Brand.getBrandContext as any).mockResolvedValueOnce({ policy: {} });
  (Core.evaluateRouteAccess as any).mockReturnValueOnce({ allowed: false });

  const r = await server.fetch(
    req('http://localhost:3000/fr.data', new Headers([['x-remix-data', 'yes']])),
    { BRAND_ID: 'x' } as any,
    {} as any,
  );
  expect(r.status).toBe(404);
});

test('errorResponse stage=context when createAppLoadContext fails', async () => {
  const { createAppLoadContext } = await import('@/server/context');
  (createAppLoadContext as any).mockRejectedValueOnce(new Error('ctx-err'));

  const r = await server.fetch(req('http://localhost:3000/'), {} as any, {} as any);
  expect(r.status).toBe(500);

  expect(r.headers.get('Content-Type')).toBe('application/json');
  const body = await r.json<ErrBody>();
  expect(body.stage).toBe('context');
  expect(body.name).toBe('Error');
});

test('errorResponse stage=policy when getBrandContext fails for data request', async () => {
  const Brand = await import('./app/server/brand');
  (Brand.getBrandContext as any).mockRejectedValueOnce(new Error('policy-err'));

  const r = await server.fetch(
    req('http://localhost:3000/a.data?_data=1', new Headers([['x-remix-data', 'yes']])),
    { BRAND_ID: 'x' } as any,
    {} as any,
  );
  expect(r.status).toBe(500);
  const body = await r.json<ErrBody>();
  expect(body.stage).toBe('policy');
  expect(body.name).toBe('Error');
});

test('errorResponse stage=handle when handler factory throws', async () => {
  (Remix.createRequestHandler as any).mockImplementationOnce(() => {
    throw new Error('boom');
  });
  const r = await server.fetch(req('http://localhost:3000/any'), {} as any, {} as any);
  expect(r.status).toBe(500);
  const body = await r.json<ErrBody>();
  expect(body.stage).toBe('handle');
  expect(body.name).toBe('Error');
});

test('propagates load context to handler via getLoadContext', async () => {
  const marker = { mark: 123 };
  const { createAppLoadContext } = await import('@/server/context');
  (createAppLoadContext as any).mockResolvedValueOnce({
    storefront: marker,
    session: { isPending: false, commit: vi.fn() },
  });

  await server.fetch(req('http://localhost:3000/ok'), {} as any, {} as any);
  const call = (Remix.createRequestHandler as any).mock.calls.at(-1)[0];
  const ctx = call.getLoadContext();
  expect(ctx.storefront).toBe(marker);
});

test('appends Set-Cookie when session.isPending is true', async () => {
  const { createAppLoadContext } = await import('@/server/context');
  (createAppLoadContext as any).mockResolvedValueOnce({
    storefront: {},
    session: { isPending: true, commit: vi.fn(async () => 'sid=1') },
  });

  const r = await server.fetch(req('http://localhost:3000/ok'), {} as any, {} as any);
  expect(r.headers.get('Set-Cookie')).toContain('sid=1');
});
