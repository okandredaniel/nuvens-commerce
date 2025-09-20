import { expect, it, vi } from 'vitest';

vi.mock('@react-router/fs-routes', () => ({ flatRoutes: () => Promise.resolve([{ id: 'a' }]) }));
vi.mock('@shopify/hydrogen', () => ({ hydrogenRoutes: (arr: any[]) => arr }));

it('expõe as rotas resolvidas', async () => {
  const mod = await import('./routes');
  const routes = await mod.default;
  expect(Array.isArray(routes)).toBe(true);
  expect(routes[0].id).toBe('a');
});
