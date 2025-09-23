import { localizeTo } from '@nuvens/shopify';
import type { To } from 'react-router';
import { useLocation, useRouteLoaderData } from 'react-router';

export function useLocalizedHref() {
  const data = useRouteLoaderData('root') as any;
  const { pathname } = useLocation();
  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const langFromPath = /^[A-Za-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
  const lang = langFromPath ?? data?.i18n?.locale ?? undefined;
  return (to: To) => localizeTo(to, lang);
}
