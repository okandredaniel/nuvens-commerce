import type { ShouldRevalidateFunction } from '@remix-run/router';

export const shouldRevalidate: ShouldRevalidateFunction = ({ currentUrl, nextUrl, formMethod }) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.pathname !== nextUrl.pathname) return true;
  return false;
};
