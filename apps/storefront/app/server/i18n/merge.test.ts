import { describe, expect, it, vi } from 'vitest';

vi.mock('@nuvens/core', () => ({
  coreI18n: {
    resources: {
      en: {
        common: { ok: 'core', coreKeep: 'k' },
        coreOnly: { c: 1 },
        shared: { from: 'core' },
      },
      pt: {
        coreOnly: { c: 2 },
        onlyPT: { z: 'p' },
      },
    },
  },
}));

import { mergeI18nResources } from './merge';

describe('mergeI18nResources', () => {
  it('merges namespaces from core, brand static, brand bundle and app, with later sources overriding earlier ones', () => {
    const brandI18n = {
      resources: {
        en: {
          common: { ok: 'brandStatic', b: 'bs' },
          brandOnly: { b: 1 },
          shared: { from: 'brandStatic' },
        },
      },
    };
    const brandBundleRes = {
      common: { ok: 'bundle', bb: 'bb' },
      bundleOnly: { x: 1 },
      shared: { from: 'bundle' },
    };
    const appRes = {
      common: { ok: 'app', appKey: 'ak' },
      appOnly: { y: 2 },
      shared: { from: 'app' },
    };

    const res = mergeI18nResources('en', brandI18n as any, brandBundleRes, appRes);

    expect(res.common.ok).toBe('app');
    expect(res.common.b).toBe('bs');
    expect(res.common.coreKeep).toBe('k');
    expect(res.common.bb).toBe('bb');
    expect(res.common.appKey).toBe('ak');
    expect(res.shared.from).toBe('app');

    expect(Object.keys(res).sort()).toEqual(
      ['common', 'coreOnly', 'brandOnly', 'bundleOnly', 'appOnly', 'shared'].sort(),
    );
  });

  it('picks resources for the requested language and ignores missing ones gracefully', () => {
    const brandI18n = {
      resources: {
        pt: {
          brandOnly: { b: 7 },
        },
      },
    };
    const resPT = mergeI18nResources('pt', brandI18n as any, {}, {});

    expect(resPT.coreOnly).toEqual({ c: 2 });
    expect(resPT.onlyPT).toEqual({ z: 'p' });
    expect(resPT.brandOnly).toEqual({ b: 7 });
    expect(resPT.common).toBeUndefined();
  });

  it('handles non-object/empty inputs for brand static resources without throwing', () => {
    const res = mergeI18nResources('en', { resources: null } as any, {}, {});

    expect(res.coreOnly).toEqual({ c: 1 });
    expect(res.common).toEqual({ ok: 'core', coreKeep: 'k' });
  });
});
