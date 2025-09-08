import { Container } from '@nuvens/ui-core';
import { type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { PoliciesHeader } from '~/components/policies/PoliciesHeader';
import { PoliciesGrid, PolicyItem } from '~/components/policies/PolicyGrid';

type LoaderData = { policies: PolicyItem[] };

function isPolicyItem(p: unknown): p is PolicyItem {
  return !!p && typeof (p as any).id === 'string' && typeof (p as any).handle === 'string';
}

export async function loader({ context }: LoaderFunctionArgs) {
  const data = await context.storefront.query(POLICIES_QUERY, {
    variables: {
      country: context.storefront.i18n?.country,
      language: context.storefront.i18n?.language,
    },
  });

  const shop = data?.shop;

  const policies = [
    shop?.privacyPolicy,
    shop?.shippingPolicy,
    shop?.termsOfService,
    shop?.refundPolicy,
    shop?.subscriptionPolicy,
  ].filter(isPolicyItem);

  if (!policies.length) {
    throw new Response('Not Found', { status: 404 });
  }

  return { policies } satisfies LoaderData;
}

export default function Policies() {
  const { policies } = useLoaderData<typeof loader>();

  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <Container className="py-8 md:py-12">
        <PoliciesHeader />
        <PoliciesGrid policies={policies} />
      </Container>
    </main>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy { ...PolicyItem }
      shippingPolicy { ...PolicyItem }
      termsOfService { ...PolicyItem }
      refundPolicy { ...PolicyItem }
      subscriptionPolicy { id title handle }
    }
  }
` as const;
