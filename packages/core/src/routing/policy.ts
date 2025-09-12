import { match } from 'path-to-regexp';
import type { RouteAccessPolicy } from './routing.interface';

export function stripLocale(pathname: string): { locale?: string; path: string } {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0) return { path: '/' };
  const first = parts[0];
  if (/^[a-z]{2}$/i.test(first)) {
    const rest = '/' + parts.slice(1).join('/');
    return { locale: first.toLowerCase(), path: rest === '/' ? '/' : rest };
  }
  return { path: pathname || '/' };
}

export function prefixLocale(path: string, locale?: string): string {
  if (!locale) return path;
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}`;
}

function someMatch(path: string, patterns: readonly string[] | undefined): boolean {
  if (!patterns || patterns.length === 0) return false;
  for (const p of patterns) {
    try {
      const fn = match(p, { decode: decodeURIComponent });
      if (fn(path)) return true;
    } catch {}
  }
  return false;
}

export function evaluateRouteAccess(
  policy: RouteAccessPolicy,
  pathWithoutLocale: string,
): { allowed: boolean } {
  if (someMatch(pathWithoutLocale, policy.restrict)) return { allowed: false };
  if (someMatch(pathWithoutLocale, policy.expose)) return { allowed: true };
  return { allowed: policy.default === 'allow' };
}

export function buildRestrictedResponse(policy: RouteAccessPolicy, locale?: string): Response {
  const r = policy.restrictedResponse;
  if (r.type === 'not_found') return new Response('Not Found', { status: 404 });
  const location = prefixLocale(r.to, locale);
  return Response.redirect(location, 302);
}
