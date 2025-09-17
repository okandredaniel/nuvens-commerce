import { pageTemplates as brandPageTemplates } from '@nuvens/brand-ui';
import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { guardedLoader } from '~/lib/routing/policy';
import { pageTemplates } from '../pages';

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
  const available = new Set([
    ...Object.keys(pageTemplates),
    ...Object.keys(brandPageTemplates || {}),
  ]);
  const templateKey = candidates.find((c) => available.has(c)) || 'default';

  return { page, templateKey } satisfies LoaderData;
}

function loadDeferredData(_: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const { page, templateKey } = useLoaderData<typeof loader>();
  const BrandTemplate = (brandPageTemplates as any)?.[templateKey];
  const StorefrontTemplate = (pageTemplates as any)?.[templateKey];
  const Template =
    BrandTemplate ||
    StorefrontTemplate ||
    (brandPageTemplates as any)?.default ||
    (pageTemplates as any)?.default;
  return <Template page={page} />;
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
