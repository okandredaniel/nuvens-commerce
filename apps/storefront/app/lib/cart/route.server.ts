import { guardedLoader } from '@server/routing/guard';
import type { CartQueryDataReturn } from '@shopify/hydrogen';
import { CartForm } from '@shopify/hydrogen';
import { type ActionFunctionArgs, data, type LoaderFunctionArgs } from '@shopify/remix-oxygen';

function privateNoStoreHeaders() {
  const h = new Headers();
  h.set('Cache-Control', 'no-store');
  h.append('Vary', 'Cookie');
  return h;
}

export async function cartAction({ request, context }: ActionFunctionArgs) {
  const { cart } = context;
  const formData = await request.formData();
  const { action, inputs } = CartForm.getFormInput(formData);
  if (!action) throw new Error('No action provided');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const next: string[] = [];
      if (typeof inputs.discountCode === 'string') next.push(inputs.discountCode);
      if (Array.isArray(inputs.discountCodes)) {
        next.push(...inputs.discountCodes.filter((c): c is string => typeof c === 'string'));
      }
      result = await cart.updateDiscountCodes(next);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const next: string[] = [];
      if (typeof inputs.giftCardCode === 'string') next.push(inputs.giftCardCode);
      if (Array.isArray(inputs.giftCardCodes)) {
        next.push(...inputs.giftCardCodes.filter((c): c is string => typeof c === 'string'));
      }
      result = await cart.updateGiftCardCodes(next);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate:
      result = await cart.updateBuyerIdentity({ ...inputs.buyerIdentity });
      break;
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const extra = privateNoStoreHeaders();
  extra.forEach((v, k) => headers.append(k, v));

  const redirectTo = formData.get('redirectTo');
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: result.cart,
      errors: result.errors,
      warnings: result.warnings,
      analytics: { cartId },
    },
    { status, headers },
  );
}

export const cartLoader = guardedLoader(async ({ context }: LoaderFunctionArgs) => {
  const result = await context.cart.get();
  return data(result, { headers: privateNoStoreHeaders() });
});
