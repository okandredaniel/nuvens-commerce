import { brandDefaultLocale, brandLocales } from '@nuvens/brand-ui';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';

const SUPPORTED = new Set(
  (brandLocales?.length ? brandLocales : [brandDefaultLocale]).map(
    (l) => l.toLowerCase().split('-')[0],
  ),
);
const DEFAULT = (brandDefaultLocale || 'en').toLowerCase().split('-')[0];

export async function loader({ params, request }: LoaderFunctionArgs) {
  const seg = params.locale?.toLowerCase();
  if (!seg) return null;

  const lang = seg.split('-')[0];

  if (!SUPPORTED.has(lang)) {
    throw new Response(null, { status: 404 });
  }

  if (lang === DEFAULT) {
    const url = new URL(request.url);
    const [, ...rest] = url.pathname.split('/').filter(Boolean);
    url.pathname = '/' + rest.join('/');
    const location = url.pathname + url.search;
    return new Response(null, {
      status: 307,
      headers: {
        Location: location,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Cache-Control': 'private, no-store',
      },
    });
  }

  if (seg !== lang) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/').filter(Boolean);
    parts[0] = lang;
    url.pathname = '/' + parts.join('/');
    const location = url.pathname + url.search;
    return new Response(null, {
      status: 308,
      headers: {
        Location: location,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  return null;
}
