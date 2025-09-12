import { routeAccessPolicy } from '@nuvens/brand-ui';
import { evaluateRouteAccess, stripLocale } from '@nuvens/core';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

function aliasDataPath(path: string): string | null {
  if (path === '/collections') return '/collections.data';
  if (path === '/collections/all') return '/collections.all.data';
  if (/^\/collections\/[^/]+$/.test(path)) return '/collections/:handle.data';
  if (path === '/cart') return '/cart.data';
  return null;
}

function resolvePolicyPath(request: Request) {
  const url = new URL(request.url);
  const { path } = stripLocale(url.pathname || '/');
  if (path.endsWith('.data')) return path;
  const alias = aliasDataPath(path);
  return alias ?? path;
}

export function assertRouteAllowed(request: Request) {
  const policyPath = resolvePolicyPath(request);
  const allowed =
    !routeAccessPolicy || evaluateRouteAccess(routeAccessPolicy, policyPath).allowed !== false;
  if (!allowed) throw new Response('Not Found', { status: 404 });
}

export function guardedLoader<L extends (args: LoaderFunctionArgs) => Promise<any>>(loader: L): L {
  return (async (args: LoaderFunctionArgs) => {
    assertRouteAllowed(args.request);
    return loader(args);
  }) as L;
}
