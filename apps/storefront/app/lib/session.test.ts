import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@shopify/remix-oxygen', () => {
  const createStorage = () => {
    const store = new Map<string, unknown>();
    const flashStore = new Map<string, unknown>();
    const session = {
      has: (key: string) => store.has(key) || flashStore.has(key),
      get: (key: string) => {
        if (flashStore.has(key)) {
          const val = flashStore.get(key);
          flashStore.delete(key);
          return val;
        }
        return store.get(key);
      },
      set: (key: string, value: unknown) => {
        store.set(key, value);
      },
      unset: (key: string) => {
        store.delete(key);
        flashStore.delete(key);
      },
      flash: (key: string, value: unknown) => {
        flashStore.set(key, value);
      },
    };
    const storage = {
      getSession: vi.fn(async () => session),
      commitSession: vi.fn(async () => 'committed=1; Path=/; HttpOnly'),
      destroySession: vi.fn(async () => 'destroyed=1; Path=/; HttpOnly'),
    };
    return storage;
  };

  return {
    createCookieSessionStorage: vi.fn(createStorage),
  };
});

async function importModule() {
  return await import('./session');
}

const req = (cookie?: string) =>
  new Request('https://test.local/', { headers: cookie ? { Cookie: cookie } : undefined });

describe('AppSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('init creates storage and loads session using request cookie', async () => {
    const { AppSession } = await importModule();
    const s = await AppSession.init(req('a=1'), ['secret']);
    expect(s).toBeInstanceOf(AppSession);
    const { createCookieSessionStorage } = await import('@shopify/remix-oxygen');
    expect(createCookieSessionStorage).toHaveBeenCalledTimes(1);
    const storage = (createCookieSessionStorage as any).mock.results[0].value;
    expect(storage.getSession).toHaveBeenCalledWith('a=1');
  });

  it('proxies get/set/has/unset/flash and manages isPending', async () => {
    const { AppSession } = await importModule();
    const s = await AppSession.init(req(), ['secret']);

    expect(s.isPending).toBe(false);
    s.set('x', 1);
    expect(s.isPending).toBe(true);
    expect(s.get('x')).toBe(1);
    expect(s.has('x')).toBe(true);

    s.unset('x');
    expect(s.get('x')).toBeUndefined();
    expect(s.has('x')).toBe(false);

    s.flash('y', 42);
    expect(s.get('y')).toBe(42);
    expect(s.get('y')).toBeUndefined();
  });

  it('commit resets pending and calls commitSession', async () => {
    const { AppSession } = await importModule();
    const s = await AppSession.init(req(), ['secret']);
    s.set('k', 'v');
    const header = await s.commit();
    expect(s.isPending).toBe(false);
    const { createCookieSessionStorage } = await import('@shopify/remix-oxygen');
    const storage = (createCookieSessionStorage as any).mock.results[0].value;
    expect(storage.commitSession).toHaveBeenCalledTimes(1);
    expect(typeof header).toBe('string');
  });

  it('destroy calls destroySession', async () => {
    const { AppSession } = await importModule();
    const s = await AppSession.init(req(), ['secret']);
    const header = await s.destroy();
    const { createCookieSessionStorage } = await import('@shopify/remix-oxygen');
    const storage = (createCookieSessionStorage as any).mock.results[0].value;
    expect(storage.destroySession).toHaveBeenCalledTimes(1);
    expect(typeof header).toBe('string');
  });
});
