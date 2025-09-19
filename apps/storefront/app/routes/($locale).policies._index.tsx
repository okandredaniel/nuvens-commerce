import { PolicyCard } from '@/components/PolicyCard';
import { POLICIES_QUERY } from '@/lib/fragments';
import { Container, Heading } from '@nuvens/ui';
import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';

export type PolicyItem = { id: string; title: string; handle: string };
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
  // eslint-disable-next-line @typescript-eslint/naming-convention
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
  const { t } = useTranslation('policies');
  const { policies } = useLoaderData<typeof loader>();

  return (
    <main
      id="content"
      role="main"
      aria-labelledby="policies-heading"
      className="bg-[color:var(--color-surface)]"
    >
      <Container className="py-8 md:py-12">
        <header className="mb-8 text-center">
          <Heading as="h1" id="policies-heading" align="center">
            {t('page.title')}
          </Heading>
          <p className="mt-3">{t('page.subtitle')}</p>
        </header>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {policies.map((p) => (
            <li key={p.id}>
              <PolicyCard policy={p} />
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
