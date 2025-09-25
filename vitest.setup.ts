import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

vi.mock('@nuvens/brand-ui/styles.css?url', () => ({ default: '' }));
vi.mock('@nuvens/brand-ui/styles.css', () => ({ default: '' }));

if (typeof globalThis.ResizeObserver === 'undefined') {
  class RO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = RO as unknown as typeof ResizeObserver;
}
