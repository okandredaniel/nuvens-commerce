import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: { provider: 'v8', reportsDirectory: './coverage', reporter: ['text', 'lcov'] },
  },
  resolve: {
    alias: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@': r('./app'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@nuvens/brand-ui': r('../../packages/brand-zippex/src'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '@nuvens/core': r('../../packages/core/src'),
    },
  },
  plugins: [
    {
      name: 'stub-remix-build-virtual',
      resolveId(id) {
        if (id === 'virtual:react-router/server-build') return '\0remix-build-stub';
        return null;
      },
      load(id) {
        if (id === '\0remix-build-stub') return 'export default {}';
        return null;
      },
    },
  ],
});
