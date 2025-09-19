import { SearchForm } from '@/components/SearchForm';
import { SearchResults } from '@/components/SearchResults';
import { guardedLoader } from '@/lib/routing/guard';
import {
  getEmptyPredictiveSearchResult,
  type PredictiveSearchReturn,
  type RegularSearchReturn,
} from '@/lib/search';
import { Button, Container, Input } from '@nuvens/ui';
import { Analytics, getPaginationVariables } from '@shopify/hydrogen';
import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData, type MetaFunction } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Hydrogen | Search' }];

export const loader = guardedLoader(async ({ request, context }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');

  try {
    return isPredictive
      ? await predictiveSearch({
          request,
          context,
        })
      : await regularSearch({
          request,
          context,
        });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return isPredictive
      ? ({
          type: 'predictive',
          term: '',
          result: getEmptyPredictiveSearchResult(),
          error: message,
        } satisfies PredictiveSearchReturn)
      : ({
          type: 'regular',
          term: '',
          result: {
            total: 0,
            items: {},
          } as RegularSearchReturn['result'],
          error: message,
        } satisfies RegularSearchReturn);
  }
});

export default function SearchPage() {
  const { type, term, result, error } = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <Container className="py-8 md:py-12">
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold tracking-tight">Search</h1>

      <SearchForm>
        {({ inputRef }) => (
          <div className="flex w-full max-w-xl items-center gap-2">
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <Input
              id="q"
              ref={inputRef}
              name="q"
              type="search"
              defaultValue={term}
              placeholder="Search…"
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </div>
        )}
      </SearchForm>

      {error ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        {!term || !result?.total ? (
          <SearchResults.Empty />
        ) : (
          <SearchResults result={result} term={term}>
            {({ articles, pages, products, term }) => (
              <div className="space-y-10">
                <SearchResults.Products products={products} term={term} />
                <SearchResults.Pages pages={pages} term={term} />
                <SearchResults.Articles articles={articles} term={term} />
              </div>
            )}
          </SearchResults>
        )}
      </div>

      <Analytics.SearchView
        data={{
          searchTerm: term,
          searchResults: result,
        }}
      />
    </Container>
  );
}

/* ================= Regular search ================= */

const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image { url altText width height }
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      selectedOptions { name value }
      product { handle title }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(query: $term, types: [ARTICLE], first: $first) {
      nodes { ...on Article { ...SearchArticle } }
    }
    pages: search(query: $term, types: [PAGE], first: $first) {
      nodes { ...on Page { ...SearchPage } }
    }
    products: search(
      after: $endCursor
      before: $startCursor
      first: $first
      last: $last
      query: $term
      sortKey: RELEVANCE
      types: [PRODUCT]
      unavailableProducts: HIDE
    ) {
      nodes { ...on Product { ...SearchProduct } }
      pageInfo { ...PageInfoFragment }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

async function regularSearch({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'request' | 'context'>): Promise<RegularSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, { pageBy: 8 });
  const term = String(url.searchParams.get('q') || '');

  const { errors, ...items } = await storefront.query(SEARCH_QUERY, {
    variables: {
      ...variables,
      term,
    },
  });

  if (!items) throw new Error('No search data returned from Shopify API');

  const total = Object.values(items).reduce((acc, { nodes }: any) => acc + nodes.length, 0);
  const error = errors ? errors.map(({ message }: any) => message).join(', ') : undefined;

  return {
    type: 'regular',
    term,
    error,
    result: {
      total,
      items,
    },
  } as RegularSearchReturn;
}

/* ================= Predictive search ================= */

const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog { handle }
    image { url altText width height }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image { url altText width height }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image { url altText width height }
      price { amount currencyCode }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(limit: $limit, limitScope: $limitScope, query: $term, types: $types) {
      articles { ...PredictiveArticle }
      collections { ...PredictiveCollection }
      pages { ...PredictivePage }
      products { ...PredictiveProduct }
      queries { ...PredictiveQuery }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

async function predictiveSearch({
  request,
  context,
}: Pick<ActionFunctionArgs, 'request' | 'context'>): Promise<PredictiveSearchReturn> {
  const { storefront } = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term)
    return {
      type,
      term,
      result: getEmptyPredictiveSearchResult(),
    };

  const { predictiveSearch: items, errors } = await storefront.query(PREDICTIVE_SEARCH_QUERY, {
    variables: {
      limit,
      limitScope: 'EACH',
      term,
    },
  });

  if (errors) throw new Error(errors.map(({ message }: any) => message).join(', '));
  if (!items) throw new Error('No predictive search data returned from Shopify API');

  const total = (Object.values(items) as any[][]).reduce(
    (acc: number, arr: any[]) => acc + arr.length,
    0,
  );
  return {
    type,
    term,
    result: {
      items,
      total,
    },
  };
}
