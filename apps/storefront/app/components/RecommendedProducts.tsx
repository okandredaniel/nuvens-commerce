import { Suspense } from 'react';
import { Await } from 'react-router';
import type { ProductItemFragment } from 'storefrontapi.generated';
import { ProductItem } from '~/components/ProductItem';

type RecommendedProductsData = {
  products: {
    nodes: ProductItemFragment[];
  };
};

export function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsData | null>;
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Recommended Products</h2>
      <Suspense fallback={<div className="text-sm opacity-70">Loading...</div>}>
        <Await resolve={products}>
          {(response: RecommendedProductsData | null) =>
            response ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {response.products.nodes.map((product) => (
                  <ProductItem key={product.id} product={product} />
                ))}
              </div>
            ) : null
          }
        </Await>
      </Suspense>
    </section>
  );
}
