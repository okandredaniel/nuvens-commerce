import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

const sharedResolve = {
  alias: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@': r('./apps/storefront/app'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@nuvens/brand-ui': r('./packages/brand-zippex/src'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@nuvens/core': r('./packages/core/src'),
  },
};

const sharedPlugins = [
  {
    name: 'stub-remix-build-virtual',
    resolveId(id: string) {
      if (id === 'virtual:react-router/server-build') return '\0remix-build-stub';
      return null;
    },
    load(id: string) {
      if (id === '\0remix-build-stub') return 'export default {}';
      return null;
    },
  },
];

const coverageBase = {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html', 'json'],
  all: true,
  include: ['apps/**/*.{ts,tsx}', 'packages/**/*.{ts,tsx}'],
  exclude: [
    '**/node_modules/**',
    '**/*.d.ts',
    '**/*.test.{ts,tsx}',
    '**/__tests__/**',
    '**/__mocks__/**',
    '**/*.stories.{ts,tsx}',
    '**/vitest.setup.{ts,tsx}',
    '**/test-utils/**',
    '**/mocks/**',
    '**/fixtures/**',
    '**/vite.config.{ts,js,mjs,cjs}',
    '**/tailwind.config.{ts,js}',
    '**/postcss.config.{ts,js}',
    '**/eslint.config.{js,ts,cjs,mjs}',
    '**/*.generated.{ts,tsx}',
    '**/build/**',
    '**/dist/**',
    '**/coverage/**',
    '**/.*/**',
  ],
  thresholds: {
    perFile: true,
    lines: 80,
    branches: 70,
    functions: 80,
    statements: 80,
  },
  reportOnFailure: true,
};

export default {
  test: {
    projects: [
      {
        resolve: sharedResolve,
        plugins: sharedPlugins,
        test: {
          name: 'storefront',
          include: ['apps/storefront/**/*.{test,spec}.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['apps/storefront/vitest.setup.ts'],
          globals: true,
          coverage: { ...coverageBase, reportsDirectory: 'apps/storefront/coverage' },
        },
      },
      {
        resolve: sharedResolve,
        plugins: sharedPlugins,
        test: {
          name: 'core',
          include: ['packages/core/**/*.{test,spec}.{ts,tsx}'],
          environment: 'node',
          globals: true,
          coverage: { ...coverageBase, reportsDirectory: 'packages/core/coverage' },
        },
      },
      {
        resolve: sharedResolve,
        plugins: sharedPlugins,
        test: {
          name: 'ui',
          include: ['packages/ui/**/*.{test,spec}.{ts,tsx}'],
          environment: 'jsdom',
          globals: true,
          coverage: { ...coverageBase, reportsDirectory: 'packages/ui/coverage' },
        },
      },
    ],
  },
};
