import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { Container } from '@nuvens/ui-core';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.page?.title ?? 'Page';
  return [{ title: `Hydrogen | ${title}` }];
};

export async function loader(args: LoaderFunctionArgs) {
  const critical = await loadCriticalData(args);
  const deferred = loadDeferredData(args);
  return { ...deferred, ...critical };
}

async function loadCriticalData({ context, request, params }: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Error('Missing page handle');

  const { storefront } = context;

  const [{ page }] = await Promise.all([storefront.query(PAGE_QUERY, { variables: { handle } })]);

  if (!page) {
    throw new Response('Not Found', { status: 404 });
  }

  redirectIfHandleIsLocalized(request, { handle, data: page });

  return { page };
}

function loadDeferredData({}: LoaderFunctionArgs) {
  return {};
}

export default function Page() {
  const { page } = useLoaderData<typeof loader>();

  return (
    <Container className="py-8 md:py-12">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{page.title}</h1>
      </header>

      <main
        className="space-y-4 leading-relaxed text-[color:var(--color-on-surface)]"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </Container>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;
