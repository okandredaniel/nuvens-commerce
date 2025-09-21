import { cleanup, render } from '@testing-library/react';
import { useEffect } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  cleanup();
});

afterEach(() => {
  cleanup();
});

describe('AppContexts hooks básicos', () => {
  it('useStore/useCart/useUser/useBrand lançam erro fora dos Providers', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    const C1 = () => {
      mod.useStore();
      return null;
    };
    const C2 = () => {
      mod.useCart();
      return null;
    };
    const C3 = () => {
      mod.useUser();
      return null;
    };
    const C4 = () => {
      mod.useBrand();
      return null;
    };

    expect(() => render(<C1 />)).toThrow('useStore must be used within Providers');
    expect(() => render(<C2 />)).toThrow('useCart must be used within Providers');
    expect(() => render(<C3 />)).toThrow('useUser must be used within Providers');
    expect(() => render(<C4 />)).toThrow('useBrand must be used within Providers');
  });
});

describe('useShallowMemo', () => {
  it('mantém a mesma referência quando raso igual', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    const refs: any[] = [];
    function Probe({ obj }: { obj: Record<string, any> }) {
      const memo = mod.useShallowMemo(obj);
      useEffect(() => {
        refs.push(memo);
      });
      return null;
    }

    const { rerender } = render(<Probe obj={{ a: 1, b: 'x' }} />);
    rerender(<Probe obj={{ a: 1, b: 'x' }} />);
    expect(refs.length).toBe(2);
    expect(refs[1]).toBe(refs[0]);
  });

  it('troca a referência quando algum valor muda ou chaves mudam', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    const refs: any[] = [];
    function Probe({ obj }: { obj: Record<string, any> }) {
      const memo = mod.useShallowMemo(obj);
      useEffect(() => {
        refs.push(memo);
      });
      return null;
    }

    const { rerender } = render(<Probe obj={{ a: 1, b: 'x' }} />);
    rerender(<Probe obj={{ a: 2, b: 'x' }} />);
    rerender(<Probe obj={{ a: 2 }} />);
    expect(refs[1]).not.toBe(refs[0]);
    expect(refs[2]).not.toBe(refs[1]);
  });
});

describe('useRoutingPolicy', () => {
  it('usa defaults quando não há routing no store', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    let captured: any = null;
    function Inner({ candidates }: { candidates?: string[] }) {
      const r = mod.useRoutingPolicy(candidates);
      useEffect(() => {
        captured = r;
      });
      return null;
    }

    render(
      <mod.ProvidersMap.Store value={{}}>
        <Inner candidates={['/x', '/y', '/z']} />
      </mod.ProvidersMap.Store>,
    );

    expect(captured.isAllowed('/foo')).toBe(true);
    expect(captured.resolvePolicyPath('privacy')).toBe('/pure/privacy');
    expect(captured.recommendedFallback).toBe('/x');
  });

  it('respeita funções fornecidas pelo store.routing', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    let captured: any = null;
    function Inner() {
      const r = mod.useRoutingPolicy();
      useEffect(() => {
        captured = r;
      });
      return null;
    }

    const store = {
      routing: {
        isAllowed: (p: string) => p.startsWith('/p'),
        resolvePolicyPath: (p: string) => `/provided/${p}`,
        candidates: ['/no', '/policies', '/pages'],
      },
    };

    render(
      <mod.ProvidersMap.Store value={store}>
        <Inner />
      </mod.ProvidersMap.Store>,
    );

    expect(captured.isAllowed('/pages')).toBe(true);
    expect(captured.isAllowed('/no')).toBe(false);
    expect(captured.resolvePolicyPath('tos')).toBe('/provided/tos');
    expect(captured.recommendedFallback).toBe('/policies');
  });

  it('prioriza recommendedFallback fornecido', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    let captured: any = null;
    function Inner() {
      const r = mod.useRoutingPolicy();
      useEffect(() => {
        captured = r;
      });
      return null;
    }

    const store = {
      routing: {
        isAllowed: (p: string) => p.includes('ok'),
        candidates: ['/bad', '/also-bad', '/ok-here'],
        recommendedFallback: '/forced',
      },
    };

    render(
      <mod.ProvidersMap.Store value={store}>
        <Inner />
      </mod.ProvidersMap.Store>,
    );

    expect(captured.recommendedFallback).toBe('/forced');
  });

  it('usa candidates passados ao hook quando store não define candidates', async () => {
    vi.doMock('@/lib/routing/paths', () => ({ resolvePolicyPath: (p: string) => `/pure/${p}` }));
    const mod = await import('./AppContexts');

    let captured: any = null;
    function Inner() {
      const r = mod.useRoutingPolicy(['/a', '/b', '/c']);
      useEffect(() => {
        captured = r;
      });
      return null;
    }

    render(
      <mod.ProvidersMap.Store value={{ routing: { isAllowed: (p: string) => p === '/b' } }}>
        <Inner />
      </mod.ProvidersMap.Store>,
    );

    expect(captured.recommendedFallback).toBe('/b');
  });
});
