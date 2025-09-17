import { stripLocale } from '@nuvens/core';

function aliasDataPath(path: string): string | null {
  if (path === '/collections') return '/collections.data';
  if (path === '/collections/all') return '/collections.all.data';
  if (/^\/collections\/[^/]+$/.test(path)) return '/collections/:handle.data';
  if (path === '/cart') return '/cart.data';
  return null;
}

export function resolvePolicyPath(pathname: string): string {
  const { path } = stripLocale(pathname || '/');
  if (path.endsWith('.data')) return path;
  const alias = aliasDataPath(path);
  return alias ?? path;
}
