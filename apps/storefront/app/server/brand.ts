let cache: { policy: any; brandI18n: any; brand: any } | null = null;

export async function getBrandContext(env?: { BRAND_ID?: string }) {
  if (cache) return cache;
  try {
    const mod = await import('@nuvens/brand-ui');
    const policy = (mod as any).routeAccessPolicy ?? null;
    const brandI18n = (mod as any).brandI18n ?? null;
    const brandTokens = (mod as any).brandTokens;
    const brand = { id: env?.BRAND_ID ?? process.env.BRAND_ID, tokens: brandTokens };
    cache = { policy, brandI18n, brand };
    return cache;
  } catch {
    cache = { policy: null, brandI18n: null, brand: null };
    return cache;
  }
}
