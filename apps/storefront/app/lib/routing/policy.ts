import { routeAccessPolicy } from '@nuvens/brand-ui';
import { evaluateRouteAccess, stripLocale } from '@nuvens/ui-core';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

function normalizedPathFromRequest(request: Request) {
  const url = new URL(request.url);
  let pathname = url.pathname || '/';
  if (pathname.endsWith('.data')) pathname = pathname.slice(0, -5);
  if (url.searchParams.has('_data')) {
    const docUrl = new URL(pathname, url.origin);
    pathname = docUrl.pathname || '/';
  }
  const { path } = stripLocale(pathname);
  return path || '/';
}

export function assertRouteAllowed(request: Request) {
  const path = normalizedPathFromRequest(request);
  const allowed =
    !routeAccessPolicy || evaluateRouteAccess(routeAccessPolicy, path).allowed !== false;
  if (!allowed) throw new Response('Not Found', { status: 404 });
}

export function guardedLoader<L extends (args: LoaderFunctionArgs) => Promise<any>>(loader: L): L {
  return (async (args: LoaderFunctionArgs) => {
    assertRouteAllowed(args.request);
    return loader(args);
  }) as L;
}
