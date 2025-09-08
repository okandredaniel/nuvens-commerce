export type SelectedPolicyKey =
  | 'privacyPolicy'
  | 'shippingPolicy'
  | 'termsOfService'
  | 'refundPolicy'
  | 'subscriptionPolicy';

export const HANDLE_TO_POLICY_KEY: Record<string, SelectedPolicyKey> = {
  'privacy-policy': 'privacyPolicy',
  'shipping-policy': 'shippingPolicy',
  'terms-of-service': 'termsOfService',
  'refund-policy': 'refundPolicy',
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
