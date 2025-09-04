import { Container } from '@nuvens/ui-core';
import {
  Analytics,
  getAdjacentAndFirstAvailableVariants,
  getProductOptions,
  getSelectedProductOptions,
  useOptimisticVariant,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData, type MetaFunction } from 'react-router';
import { ProductForm } from '~/components/ProductForm';
import { ProductImage } from '~/components/ProductImage';
import { ProductPrice } from '~/components/ProductPrice';
import { redirectIfHandleIsLocalized } from '~/lib/redirect';
import { buildCanonical } from '~/lib/seo';

type RootLoaderData = {
  header?: { shop?: { primaryDomain?: { url?: string } } };
  origin?: string;
};

export const meta: MetaFunction<typeof loader> = ({ data, location, matches }) => {
  const rootData = matches[0].data as RootLoaderData;
  const base = rootData.header?.shop?.primaryDomain?.url || rootData.origin || '';
  const canonical = buildCanonical(base, `/products/${data?.product.handle || ''}`, '');
  return [
    { title: data?.product?.seo?.title || data?.product?.title || '' },
    {
      name: 'description',
      content: data?.product?.seo?.description || data?.product?.description || '',
    },
    { rel: 'canonical', href: canonical },
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

  const [{ product }] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: { handle, selectedOptions: getSelectedProductOptions(request) },
    }),
  ]);

  if (!product?.id) throw new Response(null, { status: 404 });

  redirectIfHandleIsLocalized(request, { handle, data: product });

  return { product };
}

function loadDeferredData(_: LoaderFunctionArgs) {
  return {};
}

export default function Product() {
  const { product } = useLoaderData<typeof loader>();
  const { t } = useTranslation(['product', 'common']);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const { title, descriptionHtml } = product;

  return (
    <Container className="py-6 md:py-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductImage image={selectedVariant?.image} />
        </div>

        <aside className="lg:sticky lg:top-24">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>

          <div className="mt-3">
            <ProductPrice
              price={selectedVariant?.price}
              compareAtPrice={selectedVariant?.compareAtPrice}
            />
          </div>

          <div className="mt-6">
            <ProductForm productOptions={productOptions} selectedVariant={selectedVariant} />
          </div>

          {descriptionHtml ? (
            <section className="mt-8">
              <h2 className="mb-2 text-base font-semibold">
                {t('description', { ns: 'product' })}
              </h2>
              <div
                className="prose prose-sm prose-neutral max-w-none
                           [&_img]:rounded-lg
                           dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </section>
          ) : null}
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

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice { amount currencyCode }
    id
    image { __typename id url altText width height }
    price { amount currencyCode }
    product { title handle }
    selectedOptions { name value }
    sku
    title
    unitPrice { amount currencyCode }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch {
          color
          image { previewImage { url } }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) { ...ProductVariant }
    adjacentVariants (selectedOptions: $selectedOptions) { ...ProductVariant }
    seo { description title }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
  }
  ${PRODUCT_FRAGMENT}
` as const;
