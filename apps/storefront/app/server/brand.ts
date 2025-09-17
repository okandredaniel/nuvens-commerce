export async function getBrandContext() {
  try {
    const mod = await import('@nuvens/brand-ui');
    const policy = (mod as any).routeAccessPolicy ?? null;
    const brandI18n = (mod as any).brandI18n ?? null;
    const brandTokens = (mod as any).brandTokens;
    const brand = { id: process.env.BRAND_ID, tokens: brandTokens };
    return { policy, brandI18n, brand };
  } catch {
    return { policy: null, brandI18n: null, brand: null };
  }
}
