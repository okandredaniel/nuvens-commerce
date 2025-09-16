import { routeAccessPolicy } from '@nuvens/brand-ui';
import { evaluateRouteAccess } from '@nuvens/core';

function aliasDataPath(path: string): string | null {
  if (path === '/collections') return '/collections.data';
  if (path === '/collections/all') return '/collections.all.data';
  if (/^\/collections\/[^/]+$/.test(path)) return '/collections/:handle.data';
  if (path === '/cart') return '/cart.data';
  return null;
}

export function resolvePolicyPath(path: string) {
  if (path.endsWith('.data')) return path;
  const alias = aliasDataPath(path);
  return alias ?? path;
}

export function isAllowedNavigable(path: string) {
  const res = !routeAccessPolicy || evaluateRouteAccess(routeAccessPolicy, path).allowed !== false;
  return res;
}

export function getRecommendedPath(
  candidates: string[] = ['/', '/collections', '/pages', '/policies'],
) {
  for (const p of candidates) {
    if (isAllowedNavigable(p)) return p;
  }
  return '/';
}
