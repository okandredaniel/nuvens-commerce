import { afterEach, beforeEach, expect, it, vi } from 'vitest';

vi.mock('./core.adapter', () => ({ registerUiCoreAdapter: vi.fn() }));
vi.mock('react-router/dom', () => ({ HydratedRouter: () => null }));

const hydrateRootMock = vi.fn();
vi.mock('react-dom/client', () => ({ hydrateRoot: hydrateRootMock }));

const originalLocation = window.location;

beforeEach(() => {
  vi.resetModules();
  hydrateRootMock.mockReset();
});

afterEach(() => {
  Object.defineProperty(window, 'location', { value: originalLocation, configurable: true });
});

it('hidrata quando a origem não é webcache', async () => {
  Object.defineProperty(window, 'location', {
    value: { origin: 'https://example.com' } as any,
    configurable: true,
  });
  await import('./entry.client');
  expect(hydrateRootMock).toHaveBeenCalledTimes(1);
});

it('não hidrata quando a origem é webcache', async () => {
  Object.defineProperty(window, 'location', {
    value: { origin: 'https://webcache.googleusercontent.com' } as any,
    configurable: true,
  });
  await import('./entry.client');
  expect(hydrateRootMock).not.toHaveBeenCalled();
});
