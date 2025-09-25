import path from 'path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const loadWithMocks = async () => {
  vi.resetModules();

  const getSchema = vi.fn(() => 'SCHEMA');
  const pluckConfig = { pluck: true };
  const preset = { preset: true };

  vi.doMock('@shopify/hydrogen-codegen', () => ({
    __esModule: true,
    getSchema,
    pluckConfig,
    preset,
  }));

  const mod = await import('./codegen');
  return { codegen: mod.default as any, mocks: { getSchema, pluckConfig, preset } };
};

describe('codegen config', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('exports a valid CodegenConfig with correct paths and keys', async () => {
    const { codegen, mocks } = await loadWithMocks();

    expect(codegen.overwrite).toBe(true);
    expect(codegen.pluckConfig).toBe(mocks.pluckConfig);
    expect(mocks.getSchema).toHaveBeenCalledTimes(1);
    expect(mocks.getSchema).toHaveBeenCalledWith('storefront');

    const keys = Object.keys(codegen.generates);
    expect(keys).toHaveLength(1);
    const filename = keys[0];
    expect(filename.replace(/\\/g, '/')).toMatch(
      /\/packages\/shopify\/src\/types\/storefrontapi\.generated\.d\.ts$/,
    );

    const gen = codegen.generates[filename];
    expect(gen.preset).toBe(mocks.preset);
    expect(gen.schema).toBe('SCHEMA');

    const shopifySrcDir = path.dirname(path.dirname(filename));
    const shopifyDir = path.dirname(shopifySrcDir);
    const repoRoot = path.resolve(shopifyDir, '..', '..');
    const appDir = path.resolve(repoRoot, 'apps/storefront');
    const here = shopifyDir;

    const expectedDocs = [
      path.resolve(appDir, 'app/**/*.{ts,tsx,gql,graphql}'),
      path.resolve(here, 'src/**/*.{ts,tsx,gql,graphql}'),
      '!' + path.resolve(appDir, 'app/graphql/customer-account/**/*'),
      '!' + path.resolve(appDir, 'app/routes/($lang).account*/**/*'),
      '!' + path.resolve(appDir, 'app/routes/($lang).orders*/**/*'),
    ];
    expect(gen.documents).toEqual(expectedDocs);
  });

  it('does not leak extra generate targets', async () => {
    const { codegen } = await loadWithMocks();
    expect(Object.keys(codegen.generates)).toHaveLength(1);
  });
});
