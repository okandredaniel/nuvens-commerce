import { urlWithTrackingParams, type RegularSearchReturn } from '@lib/search';
import { Button } from '@nuvens/ui';
import { Image, Money, Pagination } from '@shopify/hydrogen';
import { Link } from 'react-router';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<SearchItems, ItemType> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & { term: string }) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) return null;
  return children({ ...result.items, term });
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function ItemLink({
  to,
  children,
  className = '',
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      prefetch="intent"
      to={to}
      className={
        'block rounded-lg px-3 py-2 transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] ' +
        className
      }
    >
      {children}
    </Link>
  );
}

function SearchResultsArticles({ term, articles }: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) return null;

  return (
    <Section title="Articles">
      <ul className="divide-y divide-[color:var(--color-border)] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        {articles.nodes.map((article) => {
          const href = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });
          return (
            <li key={article.id} className="first:rounded-t-xl last:rounded-b-xl">
              <ItemLink to={href}>
                <p className="text-sm font-medium">{article.title}</p>
              </ItemLink>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function SearchResultsPages({ term, pages }: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) return null;

  return (
    <Section title="Pages">
      <ul className="divide-y divide-[color:var(--color-border)] rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        {pages.nodes.map((page) => {
          const href = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });
          return (
            <li key={page.id} className="first:rounded-t-xl last:rounded-b-xl">
              <ItemLink to={href}>
                <p className="text-sm font-medium">{page.title}</p>
              </ItemLink>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function SearchResultsProducts({ term, products }: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) return null;

  return (
    <Section title="Products">
      <Pagination connection={products}>
        {({ nodes, isLoading, NextLink, PreviousLink }) => {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <PreviousLink>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? 'Loading…' : '↑ Load previous'}
                  </Button>
                </PreviousLink>
                <NextLink>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? 'Loading…' : 'Load more ↓'}
                  </Button>
                </NextLink>
              </div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nodes.map((product) => {
                  const href = urlWithTrackingParams({
                    baseUrl: `/products/${product.handle}`,
                    trackingParams: product.trackingParameters,
                    term,
                  });
                  const price = product?.selectedOrFirstAvailableVariant?.price;
                  const image = product?.selectedOrFirstAvailableVariant?.image;

                  return (
                    <li key={product.id}>
                      <ItemLink
                        to={href}
                        className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
                      >
                        <div className="flex items-center gap-3">
                          {image ? (
                            <Image
                              data={image}
                              alt={product.title}
                              width={64}
                              height={64}
                              loading="lazy"
                              className="h-16 w-16 shrink-0 rounded-md object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 shrink-0 rounded-md bg-black/5" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{product.title}</p>
                            {price ? (
                              <small className="opacity-80">
                                <Money data={price} />
                              </small>
                            ) : null}
                          </div>
                        </div>
                      </ItemLink>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center justify-between">
                <PreviousLink>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? 'Loading…' : '↑ Load previous'}
                  </Button>
                </PreviousLink>
                <NextLink>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    {isLoading ? 'Loading…' : 'Load more ↓'}
                  </Button>
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
    </Section>
  );
}

function SearchResultsEmpty() {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-4 py-6 text-sm opacity-80">
      No results, try a different search.
    </div>
  );
}
