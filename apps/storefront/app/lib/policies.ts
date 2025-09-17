import type { Shop } from '@shopify/hydrogen/storefront-api-types';

export type SelectedPolicyKey = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy' | 'subscriptionPolicy'
>;

export const HANDLE_TO_POLICY_KEY: Record<string, SelectedPolicyKey> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'privacy-policy': 'privacyPolicy',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'shipping-policy': 'shippingPolicy',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'terms-of-service': 'termsOfService',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'refund-policy': 'refundPolicy',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'subscription-policy': 'subscriptionPolicy',
};

export function getPolicyKeyFromHandle(handle: string): SelectedPolicyKey | null {
  const normalized = handle.trim().toLowerCase();
  return HANDLE_TO_POLICY_KEY[normalized] ?? null;
}

export function buildPolicyQueryVars(selected: SelectedPolicyKey) {
  return {
    privacyPolicy: selected === 'privacyPolicy',
    shippingPolicy: selected === 'shippingPolicy',
    termsOfService: selected === 'termsOfService',
    refundPolicy: selected === 'refundPolicy',
    subscriptionPolicy: selected === 'subscriptionPolicy',
  };
}
