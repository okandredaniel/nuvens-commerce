import { localizeTo } from '@/i18n/localize';
import type { RootLoader } from '@/root';
import type { To } from 'react-router';
import { useLocation, useRouteLoaderData } from 'react-router';

export function useLocalizedHref() {
  const data = useRouteLoaderData<RootLoader>('root') as any;
  const { pathname } = useLocation();

  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const langFromPath = /^[A-Za-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
  const lang = langFromPath ?? data?.i18n?.locale;

  return (to: To) => localizeTo(to, lang);
}
