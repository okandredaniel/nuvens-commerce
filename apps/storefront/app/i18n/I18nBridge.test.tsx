import { render } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import I18nBridge from './I18nBridge';

let currentI18n: any;
const useRouteLoaderDataMock = vi.fn();
const useLocationMock = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual<any>('react-router');
  return {
    ...actual,
    useRouteLoaderData: (...args: any[]) => useRouteLoaderDataMock(...args),
    useLocation: (...args: any[]) => useLocationMock(...args),
  };
});

vi.mock('react-i18next', async () => {
  const actual = await vi.importActual<any>('react-i18next');
  return {
    ...actual,
    useTranslation: () => ({ i18n: currentI18n }),
  };
});

beforeEach(() => {
  document.documentElement.lang = '';
  useRouteLoaderDataMock.mockReset();
  useLocationMock.mockReset();
  currentI18n = {
    language: 'en',
    changeLanguage: vi.fn(),
    addResourceBundle: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
});

test('changes language, sets <html lang>, and adds resources from loader', async () => {
  useRouteLoaderDataMock.mockReturnValue({
    i18n: { locale: 'fr', resources: { common: { hello: 'salut' } } },
  });
  useLocationMock.mockReturnValue({ pathname: '/fr' });

  render(<I18nBridge />);
  await Promise.resolve();

  expect(currentI18n.changeLanguage).toHaveBeenCalledWith('fr');
  expect(document.documentElement.lang).toBe('fr');
  expect(currentI18n.addResourceBundle).toHaveBeenCalledWith(
    'fr',
    'common',
    { hello: 'salut' },
    true,
    true,
  );
});

test('does not change language when already active but ensures <html lang>', async () => {
  currentI18n.language = 'es';
  useRouteLoaderDataMock.mockReturnValue({ i18n: { locale: 'es', resources: {} } });
  useLocationMock.mockReturnValue({ pathname: '/es' });

  render(<I18nBridge />);
  await Promise.resolve();

  expect(currentI18n.changeLanguage).not.toHaveBeenCalled();
  expect(document.documentElement.lang).toBe('es');
});

test('re-runs on pathname change and reapplies resource bundle', async () => {
  const resources = { common: { ok: 'ok' } };
  let path = '/fr/a';
  useRouteLoaderDataMock.mockReturnValue({ i18n: { locale: 'fr', resources } });
  useLocationMock.mockImplementation(() => ({ pathname: path }));

  const { rerender } = render(<I18nBridge />);
  await Promise.resolve();

  const firstCalls = currentI18n.addResourceBundle.mock.calls.length;

  path = '/fr/b';
  rerender(<I18nBridge />);
  await Promise.resolve();

  expect(currentI18n.addResourceBundle.mock.calls.length).toBeGreaterThan(firstCalls);
});
