import { Container } from '@nuvens/ui-core';
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useLoaderData } from 'react-router';
import { PoliciesHeader } from '~/components/policies/PoliciesHeader';
import { PoliciesGrid, type PolicyItem } from '~/components/policies/PolicyGrid';
import { POLICIES_QUERY } from '~/lib/fragments';

type LoaderData = { policies: PolicyItem[] };

function isPolicyItem(p: unknown): p is PolicyItem {
  return (
    !!p &&
    typeof (p as any).id === 'string' &&
    typeof (p as any).handle === 'string' &&
    typeof (p as any).title === 'string'
  );
}

export const meta: MetaFunction<typeof loader> = () => [
  { title: 'Policies' },
  {
    name: 'description',
    content: 'Learn how we handle privacy, shipping, returns, subscriptions, and more.',
  },
];

export const headers: HeadersFunction = () => {
  return { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=3600' };
};

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
    <main
      id="content"
      role="main"
      aria-labelledby="policies-heading"
      className="bg-[color:var(--color-surface)]"
    >
      <Container className="py-8 md:py-12">
        <PoliciesHeader headingId="policies-heading" />
        <PoliciesGrid policies={policies} />
      </Container>
    </main>
  );
}
