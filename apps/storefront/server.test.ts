// apps/storefront/server.test.ts
import { expect, test, vi } from 'vitest';

vi.mock('@/lib/context', () => ({
  createAppLoadContext: vi.fn(async () => ({
    storefront: {},
    session: { isPending: false, commit: vi.fn() },
  })),
}));

vi.mock('@/lib/routing/paths', () => ({
  resolvePolicyPath: vi.fn((p: string) => p),
}));

vi.mock('@nuvens/core', () => ({
  evaluateRouteAccess: vi.fn(() => ({ allowed: true })),
}));

vi.mock('@shopify/hydrogen', () => ({
  storefrontRedirect: vi.fn(
    ({ response }: { response: Response }) =>
      // eslint-disable-next-line @typescript-eslint/naming-convention
      new Response('redirected', { status: response.status, headers: { 'X-Redirected': '1' } }),
  ),
}));

vi.mock('@shopify/remix-oxygen', () => {
  const createRequestHandler = vi.fn(() => async (req: Request) => {
    const path = new URL(req.url).pathname;
    if (path === '/cause404') return new Response('', { status: 404 });
    return new Response(JSON.stringify({ path }), {
      status: 200,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { 'Content-Type': 'application/json' },
    });
  });
  return { createRequestHandler };
});

vi.mock('./app/server/brand', () => ({
  getBrandContext: vi.fn(async () => ({ policy: null })),
}));

vi.mock('virtual:react-router/server-build', () => ({}));

import * as Core from '@nuvens/core';
import { storefrontRedirect } from '@shopify/hydrogen';
import * as Brand from './app/server/brand';
import server from './server';

function req(u: string, h?: Record<string, string>) {
  return new Request(u, { headers: h });
}

test('normalizes /.data to /_root.data before handling', async () => {
  const r = await server.fetch(
    // eslint-disable-next-line @typescript-eslint/naming-convention
    req('http://localhost:3000/.data?_data=1', { 'x-remix-data': 'yes' }),
    {} as any,
    {} as any,
  );
  const data = (await r.json()) as { path: string };
  expect(data.path).toBe('/_root.data');
});

test('returns storefrontRedirect when handler returns 404 for non-data requests', async () => {
  const r = await server.fetch(req('http://localhost:3000/cause404'), {} as any, {} as any);
  expect(r.headers.get('X-Redirected')).toBe('1');
  expect((storefrontRedirect as any).mock.calls.length).toBeGreaterThan(0);
});

test('policy denies .data path and returns 404 without calling redirect', async () => {
  (Brand.getBrandContext as any).mockResolvedValueOnce({ policy: {} });
  (Core.evaluateRouteAccess as any).mockReturnValueOnce({ allowed: false });
  const r = await server.fetch(
    req('http://localhost:3000/fr.data'),
    { BRAND_ID: 'x' } as any,
    {} as any,
  );
  expect(r.status).toBe(404);
});
