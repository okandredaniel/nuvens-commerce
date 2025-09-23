import { PRODUCT_QUERY } from '@/lib/fragments';
import { redirectIfHandleIsLocalized } from '@/lib/redirect';
import { buildCanonical } from '@/lib/seo';
import type { RootLoader } from '@/root';
import { ProductPage } from '@nuvens/brand-ui';
import { getPdpMetaMock, type ProductTemplateSlots } from '@nuvens/core';
import { ProductForm, ProductPrice, ProductRating, RichText } from '@nuvens/shopify';
import { ProductGallery } from '@nuvens/ui';
import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  Image,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useEffect, useMemo } from 'react';
import { useLoaderData, useRouteLoaderData } from 'react-router';

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
    {
      name: 'description',
      content: description,
    },
    {
      tagName: 'link',
      rel: 'canonical',
      href: buildCanonical(base, location.pathname, location.search),
    },
  ];
};

export async function loader({ context, params, request }: LoaderFunctionArgs) {
  const { handle } = params;
  const { storefront } = context;
  if (!handle) throw new Error('Expected product handle to be defined');
  const selectedOptions = getSelectedProductOptions(request) || [];
  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {
        handle,
        selectedOptions,
      },
    }),
  ]);
  if (!product?.id) throw new Response(null, { status: 404 });
  redirectIfHandleIsLocalized(request, {
    handle,
    data: product,
  });
  return { product };
}

export default function ProductRoute() {
  const { product } = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const data = useRouteLoaderData<RootLoader>('root') as any;
  const meta = getPdpMetaMock(data?.i18n?.locale, (product as any)?.handle);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const maxQty = useMemo(() => {
    const v = Number.parseInt((selectedVariant as any)?.metafield?.value ?? '', 10);
    const p = Number.parseInt((product as any)?.metafield?.value ?? '', 10);
    const candidate = Number.isFinite(v) && v > 0 ? v : Number.isFinite(p) && p > 0 ? p : NaN;
    return Number.isFinite(candidate) ? candidate : 10;
  }, [product, selectedVariant]);

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
      (window as any).dataLayer?.push?.({
        event: 'add_to_cart',
        ...payload,
      });
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

  const slots: ProductTemplateSlots = {
    ProductGallery,
    ProductPrice,
    ProductForm,
    ProductRating,
    RichText,
    Image,
  };

  return (
    <>
      <ProductPage
        product={product}
        selectedVariant={selectedVariant}
        productOptions={productOptions}
        maxQty={maxQty}
        slots={slots}
        meta={meta}
      />
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
    </>
  );
}
