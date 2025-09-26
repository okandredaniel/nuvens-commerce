import { redirectIfHandleIsLocalized } from '@/lib/redirect';
import { guardedLoader } from '@/lib/routing/guard';
import { pageTemplates as brandPageTemplates } from '@nuvens/brand-ui';
import { Image } from '@shopify/hydrogen';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';
import { pageTemplates } from '../pages/PageTemplates';

type LoaderData = {
  page: {
    id: string;
    handle: string;
    title: string;
    body: string;
    seo?: { title?: string | null; description?: string | null } | null;
    templateMeta?: { value?: string | null } | null;
  };
  templateKey: string;
};

function regKeys(reg: any): string[] {
  if (!reg) return [];
  return reg instanceof Map ? Array.from(reg.keys()) : Object.keys(reg);
}

function regGet<T>(reg: any, key: string): T | undefined {
  return reg instanceof Map ? reg.get(key) : reg?.[key];
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.page?.seo?.title || data?.page?.title || 'Page';
  const desc = data?.page?.seo?.description || undefined;
  return [{ title }, ...(desc ? [{ name: 'description', content: desc }] : [])];
};

export const loader = guardedLoader(async (args: LoaderFunctionArgs) => {
  const critical = await loadCriticalData(args);
  const deferred = loadDeferredData(args);
  return { ...deferred, ...critical };
});

async function loadCriticalData({ context, request, params }: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Error('Missing page handle');

  const { storefront } = context;
  const { page } = await storefront.query(PAGE_QUERY, { variables: { handle } });
  if (!page) throw new Response('Not Found', { status: 404 });

  redirectIfHandleIsLocalized(request, { handle, data: page });

  const normalize = (v?: string | null) =>
    (v || '')
      .toLowerCase()
      .replace(/\.liquid$/i, '')
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const candidates = [normalize(page.templateMeta?.value), normalize(page.handle)].filter(Boolean);
  const available = new Set<string>([...regKeys(pageTemplates), ...regKeys(brandPageTemplates)]);
  const templateKey = candidates.find((c) => available.has(c)) || 'default';

  return { page, templateKey } satisfies LoaderData;
}

function loadDeferredData(_: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const { page, templateKey } = useLoaderData<typeof loader>();
  const BrandTemplate = regGet<any>(brandPageTemplates, templateKey);
  const StorefrontTemplate = regGet<any>(pageTemplates, templateKey);
  const DefaultBrand = regGet<any>(brandPageTemplates, 'default');
  const DefaultStorefront = regGet<any>(pageTemplates, 'default');
  const Template = BrandTemplate || StorefrontTemplate || DefaultBrand || DefaultStorefront;
  return <Template page={page} Image={Image} />;
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      id
      handle
      title
      body
      seo { title description }
      templateMeta: metafield(namespace: "app", key: "template") { value }
    }
  }
` as const;
