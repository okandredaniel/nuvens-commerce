import type { ShouldRevalidateFunction } from 'react-router';

export const shouldRevalidate: ShouldRevalidateFunction = ({ formMethod, currentUrl, nextUrl }) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.pathname !== nextUrl.pathname) return true;
  return false;
};
