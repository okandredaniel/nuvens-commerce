import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./domains', () => ({
  buildCspSources: vi.fn((env: any) => ({ fromDomains: true, envUsed: env })),
}));

vi.mock('@shopify/hydrogen', () => ({
  createContentSecurityPolicy: vi.fn((sources: any) => ({
    header: 'content-security-policy',
    sources,
  })),
}));

import { createContentSecurityPolicy } from '@shopify/hydrogen';
import { buildCspSources } from './domains';
import { createHydrogenCSP } from './policy';

describe('createHydrogenCSP', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes context.env to buildCspSources and returns CSP from hydrogen helper', () => {
    const context = { env: { FOO: 'bar' } };
    const res = createHydrogenCSP(context);
    expect(buildCspSources).toHaveBeenCalledWith(context.env);
    expect(createContentSecurityPolicy).toHaveBeenCalledWith({
      fromDomains: true,
      envUsed: context.env,
    });
    expect(res).toEqual({
      header: 'content-security-policy',
      sources: { fromDomains: true, envUsed: context.env },
    });
  });

  it('defaults env to {} when missing', () => {
    const context = {};
    const res = createHydrogenCSP(context);
    expect(buildCspSources).toHaveBeenCalledWith({});
    expect(createContentSecurityPolicy).toHaveBeenCalledWith({ fromDomains: true, envUsed: {} });
    expect(res).toEqual({
      header: 'content-security-policy',
      sources: { fromDomains: true, envUsed: {} },
    });
  });
});
