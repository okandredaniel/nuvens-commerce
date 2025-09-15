import { Container, Heading } from '@nuvens/ui';
import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { CircleCheckBig } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import { ProductForm } from '~/components/ProductForm';
import { ProductGallery } from '~/components/ProductGallery';
import { ProductPrice } from '~/components/ProductPrice';
import { RichText } from '~/components/RichText';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildCanonical } from '~/lib/seo';
import { PRODUCT_QUERY } from '../lib/fragments';

type RootLoaderData = {
  header?: { shop?: { primaryDomain?: { url?: string } } };
  origin?: string;
};

export const meta: MetaFunction<typeof loader> = ({ data, location, matches }) => {
  const rootData = matches[0].data as RootLoaderData;
  const base = rootData.header?.shop?.primaryDomain?.url || rootData.origin || '';
  const title = data?.product?.seo?.title || data?.product?.title || '';
  const description = data?.product?.seo?.description || data?.product?.description || '';
  return [
    { title },
    { name: 'description', content: description },
    {
      tagName: 'link',
      rel: 'canonical',
      href: buildCanonical(base, location.pathname, location.search),
    },
  ];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}

async function loadCriticalData({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  if (!handle) throw new Error('Expected product handle to be defined');
  const selectedOptions = getSelectedProductOptions(request) || [];
  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, { variables: { handle, selectedOptions } }),
  ]);
  if (!product?.id) throw new Response(null, { status: 404 });
  redirectIfHandleIsLocalized(request, { handle, data: product });
  return { product };
}

function loadDeferredData(_: LoaderFunctionArgs) {
  return {};
}

export default function ProductRoute() {
  const { product } = useLoaderData<typeof loader>();
  const { t: tProduct } = useTranslation('product');

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail as { variantId?: string; quantity?: number };
      const payload = {
        productId: product.id,
        productTitle: product.title,
        vendor: product.vendor,
        variantId: detail?.variantId || selectedVariant?.id || '',
        quantity: detail?.quantity ?? 1,
        price: selectedVariant?.price?.amount || '0',
      };
      (window as any).dataLayer?.push?.({ event: 'add_to_cart', ...payload });
    }
    window.addEventListener('analytics:add_to_cart', handler as EventListener);
    return () => window.removeEventListener('analytics:add_to_cart', handler as EventListener);
  }, [
    product.id,
    product.title,
    product.vendor,
    selectedVariant?.id,
    selectedVariant?.price?.amount,
  ]);

  return (
    <Container className="py-6 md:py-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <section aria-label={tProduct('media', 'Product media')}>
          <ProductGallery product={product} variantImage={selectedVariant?.image} />
        </section>

        <aside className="lg:sticky lg:top-24" aria-labelledby="product-title">
          <Heading id="product-title" as="h1">
            {product.title}
          </Heading>

          <div className="mt-3" role="status" aria-live="polite">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          {product.descriptionHtml ? (
            <section className="mt-8" aria-labelledby="product-description-heading">
              <h2 id="product-description-heading" className="mb-2 text-base font-semibold">
                {tProduct('description')}
              </h2>
              <RichText
                html={product.descriptionHtml}
                className="prose prose-sm prose-neutral max-w-none [&_img]:rounded-lg dark:prose-invert"
              />
            </section>
          ) : null}

          <ul className="flex flex-col gap-4 my-8">
            <li className="flex gap-2">
              <CircleCheckBig className="text-[#00C7D5]" />
              Élu meilleur matelas 9 fois de suite par l’association de consommateurs
            </li>
            <li className="flex gap-2">
              <CircleCheckBig className="text-[#00C7D5]" />
              Convient à toutes les morphologies, positions de sommeil et types de sommiers
            </li>
            <li className="flex gap-2">
              <CircleCheckBig className="text-[#00C7D5]" />
              Entièrement modulable – 6 niveaux de confort en un seul matelas
            </li>
            <li className="flex gap-2">
              <CircleCheckBig className="text-[#00C7D5]" />
              Conçu aux Pays-Bas avec des étudiants de la TU Delft et fabriqué en Europe
            </li>
          </ul>

          <div className="mt-6">
            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
          </div>
        </aside>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </Container>
  );
}
