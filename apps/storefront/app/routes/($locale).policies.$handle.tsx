import { Button, Container } from '@nuvens/ui';
import type { LoaderFunctionArgs, MetaFunction } from '@shopify/remix-oxygen';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLoaderData } from 'react-router';
import { RichText } from '~/components/RichText';
import { POLICY_CONTENT_QUERY } from '~/lib/fragments';
import {
  buildPolicyQueryVars,
  getPolicyKeyFromHandle,
  type SelectedPolicyKey,
} from '~/lib/policies';

type Policy = { id: string; title: string; handle: string; body: string; url: string };
type LoaderData = { policy: Policy };

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const title = data?.policy?.title ? `${data.policy.title}` : 'Policy';
  return [{ title }];
};

export async function loader({ params, context }: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Missing policy handle', { status: 404 });

  const policyKey = getPolicyKeyFromHandle(handle) as SelectedPolicyKey | null;
  if (!policyKey) throw new Response('Unknown policy', { status: 404 });

  const vars = buildPolicyQueryVars(policyKey);

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      ...vars,
      language: context.storefront.i18n?.language,
    },
  });

  const shop = (data as any).shop as Partial<Record<SelectedPolicyKey, Policy | null>>;
  const policy = shop?.[policyKey] ?? null;
  if (!policy) throw new Response('Policy not found', { status: 404 });

  return { policy } satisfies LoaderData;
}

export default function PolicyRoute() {
  const { policy } = useLoaderData<typeof loader>();
  const { t } = useTranslation('policies');

  return (
    <main id="content" role="main" className="bg-[color:var(--color-surface)]">
      <Container className="py-8 md:py-12">
        <nav aria-label={t('breadcrumb.aria')} className="mb-6">
          <Button asChild variant="outline" size="md" className="gap-2">
            <Link to="/policies">
              <ChevronLeft className="h-4 w-4" />
              {t('breadcrumb.back')}
            </Link>
          </Button>
        </nav>

        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--color-on-surface)]">
            {policy.title}
          </h1>
        </header>

        <RichText html={policy.body} />
      </Container>
    </main>
  );
}
