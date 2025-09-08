import { Card, CardContent, Container } from '@nuvens/ui-core';
import { getPaginationVariables, Image } from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import type { CollectionFragment } from 'storefrontapi.generated';
import { LocalizedLink } from '~/components/LocalizedLink';
import { PaginatedResourceSection } from '~/components/PaginatedResourceSection';
import { PAGE_SIZE } from '~/lib/constants';
import { COLLECTION_CARD_FRAGMENT } from '~/lib/fragments/catalog';

export const meta: MetaFunction<typeof loader> = () => [{ title: 'Collections' }];

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = {};
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, request }: LoaderFunctionArgs) {
  const pagination = getPaginationVariables(request, { pageBy: PAGE_SIZE });
  const [{ collections }] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, { variables: pagination }),
  ]);
  return { collections };
}

export default function CollectionsRoute() {
  const { collections } = useLoaderData<typeof loader>();
  const { t } = useTranslation('collections');

  return (
    <Container className="py-6 md:py-10">
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold tracking-tight">
        {t('title', 'Collections')}
      </h1>

      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      >
        {({ node: collection, index }: any) => (
          <CollectionCard key={collection.id} collection={collection} index={index} />
        )}
      </PaginatedResourceSection>
    </Container>
  );
}

function CollectionCard({ collection, index }: { collection: CollectionFragment; index: number }) {
  return (
    <LocalizedLink
      to={`/collections/${collection.handle}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
    >
      <Card className="transition-all hover:shadow-md hover:-translate-y-[2px]">
        <CardContent className="p-0">
          {collection.image ? (
            <Image
              data={collection.image}
              alt={collection.image.altText || collection.title}
              aspectRatio="1/1"
              loading={index < PAGE_SIZE ? 'eager' : undefined}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="rounded-t-2xl"
            />
          ) : (
            <div className="aspect-square rounded-t-2xl bg-[color:var(--color-muted)]/10" />
          )}
          <div className="p-4">
            <h2 className="text-base font-medium text-[color:var(--color-on-surface)] group-hover:underline">
              {collection.title}
            </h2>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}

const COLLECTIONS_QUERY = `#graphql
  ${COLLECTION_CARD_FRAGMENT}
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes { ...CollectionCard }
      pageInfo { hasNextPage hasPreviousPage startCursor endCursor }
    }
  }
` as const;
