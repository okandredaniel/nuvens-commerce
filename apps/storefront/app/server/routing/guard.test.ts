export {};

import { beforeEach, describe, expect, it, vi } from 'vitest';

const hoisted = vi.hoisted(() => ({
  evalMock: vi.fn(),
  resPathMock: vi.fn(),
  getBrandCtxMock: vi.fn(),
}));

vi.mock('@nuvens/core', () => ({
  evaluateRouteAccess: hoisted.evalMock,
}));

vi.mock('../../lib/routing/paths', () => ({
  resolvePolicyPath: hoisted.resPathMock,
}));

vi.mock('../brand', () => ({
  getBrandContext: hoisted.getBrandCtxMock,
}));

import { guardedLoader } from './guard';

const makeGuardArgs = (path: string = '/', overrides?: Partial<any>): any => ({
  request: new Request(`https://example.com${path}`),
  context: {},
  params: {},
  ...overrides,
});

beforeEach(() => {
  hoisted.evalMock.mockReset();
  hoisted.resPathMock.mockReset().mockImplementation((p: string) => `resolved:${p}`);
  hoisted.getBrandCtxMock.mockReset().mockResolvedValue({ policy: { rules: [] } });
});

describe('guardedLoader', () => {
  it('runs loader when no policy is configured', async () => {
    hoisted.getBrandCtxMock.mockResolvedValue({ policy: null });

    const loader = vi.fn(async () => 'ok');
    const wrapped = guardedLoader(loader as any);

    const res = await wrapped(makeGuardArgs('/a'));
    expect(res).toBe('ok');
    expect(hoisted.evalMock).not.toHaveBeenCalled();
    expect(hoisted.resPathMock).toHaveBeenCalledWith('/a');
  });

  it('allows when evaluateRouteAccess returns allowed !== false', async () => {
    hoisted.evalMock.mockReturnValue({ allowed: true });

    const loader = vi.fn(async () => 'allowed');
    const wrapped = guardedLoader(loader as any);

    await expect(wrapped(makeGuardArgs('/public'))).resolves.toBe('allowed');
    expect(hoisted.evalMock).toHaveBeenCalledWith({ rules: [] }, 'resolved:/public');
  });

  it('allows when evaluateRouteAccess returns no "allowed" field (undefined)', async () => {
    hoisted.evalMock.mockReturnValue({});

    const loader = vi.fn(async () => 'ok');
    const wrapped = guardedLoader(loader as any);

    await expect(wrapped(makeGuardArgs('/maybe'))).resolves.toBe('ok');
  });

  it('blocks and throws 404 Response when access is denied', async () => {
    hoisted.evalMock.mockReturnValue({ allowed: false });

    const loader = vi.fn(async () => 'should-not-run');
    const wrapped = guardedLoader(loader as any);

    await expect(wrapped(makeGuardArgs('/private'))).rejects.toMatchObject({ status: 404 });
    expect(loader).not.toHaveBeenCalled();
    expect(hoisted.resPathMock).toHaveBeenCalledWith('/private');
  });

  it('forwards args to the underlying loader and returns its value', async () => {
    hoisted.evalMock.mockReturnValue({ allowed: true });

    const loader = vi.fn(async ({ params }) => ({ ok: params.id }));
    const wrapped = guardedLoader(loader as any);

    const args = makeGuardArgs('/items/123', { params: { id: '123' } });
    const result = await wrapped(args);

    expect(result).toEqual({ ok: '123' });
    expect(loader).toHaveBeenCalledTimes(1);
  });

  it('passes pathname (not full URL) into resolvePolicyPath', async () => {
    hoisted.evalMock.mockReturnValue({ allowed: true });

    const loader = vi.fn(async () => 'ok');
    const wrapped = guardedLoader(loader as any);

    await wrapped(makeGuardArgs('/with/query?x=1'));
    expect(hoisted.resPathMock).toHaveBeenCalledWith('/with/query');
  });
});
