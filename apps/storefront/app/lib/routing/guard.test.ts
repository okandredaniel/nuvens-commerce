import type { LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let wrapperFn: any;
vi.mock('../../server/routing/guard', () => {
  const guardedLoader = vi.fn((loader: any) => {
    wrapperFn = vi.fn((args: any) => loader(args));
    return wrapperFn;
  });
  return { guardedLoader };
});

async function importModule() {
  return await import('./guard');
}

const args: LoaderFunctionArgs = {
  request: new Request('http://localhost/test'),
  context: {} as any,
  params: {},
};

beforeEach(() => {
  vi.clearAllMocks();
  wrapperFn = undefined;
});

describe('guardedLoader', () => {
  it('delegates to server/routing/guard.guardedLoader with provided loader', async () => {
    const { guardedLoader } = await importModule();

    const base = vi.fn(async (a: LoaderFunctionArgs) => ({
      ok: true,
      path: 'base',
      url: a.request.url,
    }));

    const wrapped = guardedLoader(base);
    const result = await wrapped(args);

    expect(result).toEqual({ ok: true, path: 'base', url: 'http://localhost/test' });
    expect(wrapperFn).toHaveBeenCalledTimes(1);
    expect(wrapperFn).toHaveBeenCalledWith(args);
    expect(base).toHaveBeenCalledTimes(1);
    expect(base).toHaveBeenCalledWith(args);
  });

  it('returns the value produced by the inner loader', async () => {
    const { guardedLoader } = await importModule();

    const base = vi.fn(async () => ({ status: 204, body: null }));
    const wrapped = guardedLoader(base);
    const res = await wrapped(args);

    expect(res).toEqual({ status: 204, body: null });
  });
});
