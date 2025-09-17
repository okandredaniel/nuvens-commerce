import { CartMain } from '@/components/cart';
import { cartAction, cartLoader } from '@lib/cart/route.server';
import { Container, Heading } from '@nuvens/ui';
import { type HeadersFunction, type MetaFunction } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';

export const meta: MetaFunction = () => [{ title: 'Cart' }];
export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export const action = cartAction;
export const loader = cartLoader;

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const { t } = useTranslation('cart');

  return (
    <section className="py-8">
      <Container>
        <Heading className="mb-8">{t('title')}</Heading>
        <CartMain layout="page" cart={cart} />
      </Container>
    </section>
  );
}
