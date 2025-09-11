import { Container } from '@nuvens/ui';
import { getPaginationVariables } from '@shopify/hydrogen';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData, type MetaFunction } from 'react-router';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { ProductItem } from '~/components/ProductItem';
import { guardedLoader } from '~/lib/routing/policy';

export const meta: MetaFunction<typeof loader> = () => [{ title: 'Products' }];

export const loader = guardedLoader(async (args: LoaderFunctionArgs) => {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
});

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const { storefront } = context;
  const paginationVariables = getPaginationVariables(request, { pageBy: 8 });
  const [{ products }] = await Promise.all([
    storefront.query(CATALOG_QUERY, { variables: { ...paginationVariables } }),
  ]);
  return { products };
}

function loadDeferredData(_: LoaderFunctionArgs) {
  return {};
}

export default function Products() {
  const { products } = useLoaderData<typeof loader>();
  const { t } = useTranslation('catalog');

  return (
    <Container className="py-6 md:py-10">
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold tracking-tight">{t('title')}</h1>

      <PaginatedResourceSection
        connection={products}
        resourcesClassName="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {({ node: product, index }: any) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </Container>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 { amount currencyCode }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage { id altText url width height }
    priceRange {
      minVariantPrice { ...MoneyCollectionItem }
      maxVariantPrice { ...MoneyCollectionItem }
    }
  }
` as const;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes { ...CollectionItem }
      pageInfo { hasPreviousPage hasNextPage startCursor endCursor }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;
