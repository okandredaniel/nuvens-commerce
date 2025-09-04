import { Container } from '@nuvens/ui-core';
import { type HeadersFunction, type MetaFunction } from '@shopify/remix-oxygen';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router';
import { CartMain } from '~/components/CartMain';
import { cartAction, cartLoader } from '~/lib/cart/route.server';

export const meta: MetaFunction = () => [{ title: 'Cart' }];
export const headers: HeadersFunction = ({ actionHeaders }) => actionHeaders;

export const action = cartAction;
export const loader = cartLoader;

export default function Cart() {
  const cart = useLoaderData<typeof loader>();
  const { t } = useTranslation('cart');

  return (
    <Container>
      <h1 className="mb-6 text-2xl md:text-3xl font-semibold tracking-tight">
        {t('pageTitle', 'Cart')}
      </h1>
      <CartMain layout="page" cart={cart} />
    </Container>
  );
}
