import { describe, expect, it } from 'vitest';

async function importPolicy() {
  return await import('./policies');
}

describe('policy utils', () => {
  it('maps known handles to SelectedPolicyKey (case/space tolerant)', async () => {
    const { getPolicyKeyFromHandle } = await importPolicy();
    expect(getPolicyKeyFromHandle('privacy-policy')).toBe('privacyPolicy');
    expect(getPolicyKeyFromHandle(' shipping-policy ')).toBe('shippingPolicy');
    expect(getPolicyKeyFromHandle('TERMS-OF-SERVICE')).toBe('termsOfService');
    expect(getPolicyKeyFromHandle('refund-policy')).toBe('refundPolicy');
    expect(getPolicyKeyFromHandle('subscription-policy')).toBe('subscriptionPolicy');
  });

  it('returns null for unknown handles', async () => {
    const { getPolicyKeyFromHandle } = await importPolicy();
    expect(getPolicyKeyFromHandle('unknown')).toBeNull();
    expect(getPolicyKeyFromHandle('')).toBeNull();
    expect(getPolicyKeyFromHandle('policy')).toBeNull();
  });

  it('builds query vars with only the selected key set to true', async () => {
    const { buildPolicyQueryVars } = await importPolicy();

    const keys: Array<keyof ReturnType<typeof buildPolicyQueryVars>> = [
      'privacyPolicy',
      'shippingPolicy',
      'termsOfService',
      'refundPolicy',
      'subscriptionPolicy',
    ];

    for (const selected of keys) {
      const vars = buildPolicyQueryVars(selected as any);
      for (const k of keys) {
        expect(vars[k]).toBe(k === selected);
      }
    }
  });

  it('end-to-end from handle to query vars', async () => {
    const { getPolicyKeyFromHandle, buildPolicyQueryVars } = await importPolicy();
    const key = getPolicyKeyFromHandle('terms-of-service');
    expect(key).toBe('termsOfService');
    const vars = buildPolicyQueryVars(key!);
    expect(vars).toEqual({
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: true,
      refundPolicy: false,
      subscriptionPolicy: false,
    });
  });
});
