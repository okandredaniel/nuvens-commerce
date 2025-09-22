import { CartMain } from '@/components/cart';
import { Container, Heading } from '@nuvens/ui';
import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Cart' }];

export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const mod = await import('@/lib/cart/route.server');
  return mod.cartLoader(args);
}

export async function action(args: ActionFunctionArgs) {
  const mod = await import('@/lib/cart/route.server');
  return mod.cartAction(args);
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const { t } = useTranslation('cart');

  return (
    <section className="py-8">
      <Container>
        <Heading as="h1" className="mb-8">
          {t('title')}
        </Heading>
        <CartMain layout="page" cart={cart} />
      </Container>
    </section>
  );
}
