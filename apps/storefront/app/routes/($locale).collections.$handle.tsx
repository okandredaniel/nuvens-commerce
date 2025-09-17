import { Container } from '@nuvens/ui';
import { getPaginationVariables } from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import { PAGE_SIZE } from '~/lib/constants';
import { PRODUCT_CARD_FRAGMENT } from '~/lib/fragments/catalog';
import { guardedLoader } from '~/server/routing/guard';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.collection?.title ? `Collections | ${data.collection.title}` : 'Collections';
  return [{ title }];
};

export const loader = guardedLoader(async (args: LoaderFunctionArgs) => {
  const deferredData = {};
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
});

async function loadCriticalData({ context, params, request }: LoaderFunctionArgs) {
  const { storefront } = context;
  const handle = params.handle;
  if (!handle) throw new Response('Missing collection handle', { status: 404 });
  const pagination = getPaginationVariables(request, { pageBy: PAGE_SIZE });
  const [{ collection }] = await Promise.all([
    storefront.query(COLLECTION_QUERY, { variables: { handle, ...pagination } }),
  ]);
  if (!collection) throw new Response(`Collection ${handle} not found`, { status: 404 });
  return { collection };
}

export default function CollectionRoute() {
  const { collection } = useLoaderData<typeof loader>();
  const { t } = useTranslation('catalog');

  return (
    <Container className="py-6 md:py-10">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{collection.title}</h1>
        {collection.description ? (
          <p className="mt-2 text-[color:var(--color-muted)]">{collection.description}</p>
        ) : null}
      </header>

      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {({ node: product, index }: any) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < PAGE_SIZE ? 'eager' : 'lazy'}
          />
        )}
      </PaginatedResourceSection>
    </Container>
  );
}

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
        nodes { ...ProductCard }
        pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
      }
    }
  }
` as const;
