import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Carousel, CarouselI18n, CarouselSlide } from './Carousel';

vi.mock('keen-slider/react.es', () => {
  const g: any = globalThis as any;
  if (!g.__keenStore) {
    const state = { track: { details: { rel: 0, maxIdx: 2 } } };
    const store: any = { state, opts: undefined, createdOnce: false };
    const instance = {
      next: vi.fn(() => {
        if (store.state.track.details.rel < store.state.track.details.maxIdx) {
          store.state.track.details.rel++;
        }
        store.opts?.slideChanged?.(store.state);
        store.opts?.detailsChanged?.(store.state);
        store.opts?.updated?.(store.state);
      }),
      prev: vi.fn(() => {
        if (store.state.track.details.rel > 0) {
          store.state.track.details.rel--;
        }
        store.opts?.slideChanged?.(store.state);
        store.opts?.detailsChanged?.(store.state);
        store.opts?.updated?.(store.state);
      }),
      moveToIdx: vi.fn((idx: number) => {
        const clamped = Math.max(0, Math.min(idx, store.state.track.details.maxIdx));
        store.state.track.details.rel = clamped;
        store.opts?.slideChanged?.(store.state);
        store.opts?.detailsChanged?.(store.state);
        store.opts?.updated?.(store.state);
      }),
      update: vi.fn(() => {
        store.opts?.updated?.(store.state);
      }),
    };
    g.__keenStore = store;
    g.__keenInstance = instance;
  }
  return {
    useKeenSlider: (opts?: any) => {
      const g: any = globalThis as any;
      g.__keenStore.opts = opts;
      if (!g.__keenStore.createdOnce) {
        queueMicrotask(() => {
          g.__keenStore.opts?.created?.(g.__keenStore.state);
          g.__keenStore.opts?.detailsChanged?.(g.__keenStore.state);
          g.__keenStore.opts?.updated?.(g.__keenStore.state);
        });
        g.__keenStore.createdOnce = true;
      }
      const refCb = vi.fn(() => {});
      return [refCb, { current: g.__keenInstance }];
    },
  };
});

const i18n: CarouselI18n = {
  label: 'Gallery',
  previous: 'Previous',
  next: 'Next',
  goTo: (i: number) => `Go to ${i}`,
  status: (i: number, total: number) => `${i} of ${total}`,
};

let originalRO: any;
let originalRaf: any;
let originalCancelRaf: any;

beforeAll(() => {
  originalRO = (global as any).ResizeObserver;
  (global as any).ResizeObserver = class {
    cb: ResizeObserverCallback;
    constructor(cb: ResizeObserverCallback) {
      this.cb = cb;
    }
    observe() {
      setTimeout(() => {
        this.cb([{ contentRect: { width: 800 } } as any], this as any);
      }, 0);
    }
    unobserve() {}
    disconnect() {}
  };
  originalRaf = (global as any).requestAnimationFrame;
  originalCancelRaf = (global as any).cancelAnimationFrame;
  (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
    setTimeout(() => cb(0), 0);
    return 1 as any;
  };
  (global as any).cancelAnimationFrame = () => {};
});

afterAll(() => {
  (global as any).ResizeObserver = originalRO;
  (global as any).requestAnimationFrame = originalRaf;
  (global as any).cancelAnimationFrame = originalCancelRaf;
});

beforeEach(() => {
  vi.clearAllMocks();
  const g: any = globalThis as any;
  if (g.__keenStore) {
    g.__keenStore.state.track.details.rel = 0;
    g.__keenStore.state.track.details.maxIdx = 2;
    g.__keenStore.createdOnce = false;
  }
});

describe('Carousel', () => {
  it('renders dots and moves to index on dot click', async () => {
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide>1</CarouselSlide>
        <CarouselSlide>2</CarouselSlide>
        <CarouselSlide>3</CarouselSlide>
      </Carousel>,
    );
    await screen.findByRole('button', { name: i18n.next });
    await screen.findByText('1 of 3');
    const dots = await screen.findAllByRole('tab');
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.click(dots[2]);
    await waitFor(() =>
      expect((globalThis as any).__keenInstance.moveToIdx).toHaveBeenCalledWith(2),
    );
    expect(dots[2]).toHaveAttribute('aria-label', 'Go to 3');
    await screen.findByText('3 of 3');
  });

  it('renders nav buttons and triggers next/prev', async () => {
    const user = userEvent.setup();
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide>A</CarouselSlide>
        <CarouselSlide>B</CarouselSlide>
        <CarouselSlide>C</CarouselSlide>
      </Carousel>,
    );
    const next = await screen.findByRole('button', { name: i18n.next });
    const prev = screen.getByRole('button', { name: i18n.previous });
    expect(prev).toBeDisabled();
    expect(next).not.toBeDisabled();
    await user.click(next);
    await waitFor(() => expect((globalThis as any).__keenInstance.next).toHaveBeenCalledTimes(1));
    await user.click(prev);
    await waitFor(() => expect((globalThis as any).__keenInstance.prev).toHaveBeenCalledTimes(1));
  });

  it('handles keyboard navigation when focused inside', async () => {
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide>A</CarouselSlide>
        <CarouselSlide>B</CarouselSlide>
        <CarouselSlide>C</CarouselSlide>
      </Carousel>,
    );
    await screen.findByRole('button', { name: i18n.next });
    const dot = (await screen.findAllByRole('tab'))[0];
    dot.focus();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    fireEvent.keyDown(window, { key: 'Home' });
    fireEvent.keyDown(window, { key: 'End' });
    const keen = (globalThis as any).__keenInstance;
    await waitFor(() => expect(keen.next).toHaveBeenCalled());
    await waitFor(() => expect(keen.prev).toHaveBeenCalled());
    await waitFor(() => expect(keen.moveToIdx).toHaveBeenCalledWith(0));
    await waitFor(() => expect(keen.moveToIdx).toHaveBeenCalledWith(2));
  });

  it('calls instance.update on ResizeObserver changes', async () => {
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide>1</CarouselSlide>
        <CarouselSlide>2</CarouselSlide>
        <CarouselSlide>3</CarouselSlide>
      </Carousel>,
    );
    await waitFor(() => expect((globalThis as any).__keenInstance.update).toHaveBeenCalled());
  });

  it('CarouselSlide supports asChild', async () => {
    render(
      <Carousel i18n={i18n}>
        <CarouselSlide asChild>
          <a href="#x">Slide Link</a>
        </CarouselSlide>
      </Carousel>,
    );
    await screen.findByRole('button', { name: i18n.next });
    expect(screen.getByRole('link', { name: 'Slide Link' })).toBeInTheDocument();
  });

  it('applies responsive bleed and edge via resolveAt based on container width', async () => {
    render(
      <Carousel
        i18n={i18n}
        bleedLeft={{ 0: 8, 800: 20 }}
        bleedRight={{ 0: 4, 800: 12 }}
        edgeLeft={{ 0: 0, 800: 16 }}
        edgeRight={{ 0: 0, 800: 24 }}
      >
        <CarouselSlide>1</CarouselSlide>
      </Carousel>,
    );
    const root = await screen.findByRole('region', { name: i18n.label });
    await waitFor(() => {
      expect(root).toHaveStyle('--bleed-left: 20px');
      expect(root).toHaveStyle('--bleed-right: 12px');
      expect(root).toHaveStyle('--edge-left: 16px');
      expect(root).toHaveStyle('--edge-right: 24px');
    });
  });

  it('builds breakpoints for responsive slidesPerView and gap', async () => {
    render(
      <Carousel i18n={i18n} slidesPerView={{ 640: 2, 1024: 3 }} gap={{ 640: 24, 1024: 32 }}>
        <CarouselSlide>1</CarouselSlide>
        <CarouselSlide>2</CarouselSlide>
        <CarouselSlide>3</CarouselSlide>
      </Carousel>,
    );
    await waitFor(() => expect((globalThis as any).__keenStore.opts?.breakpoints).toBeTruthy());
    const bps = (globalThis as any).__keenStore.opts.breakpoints;
    expect(bps).toMatchObject({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '(min-width: 640px)': { slides: { perView: 2, spacing: 24 } },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      '(min-width: 1024px)': { slides: { perView: 3, spacing: 32 } },
    });
  });

  it('merges distinct keys from slidesPerView and gap when building breakpoints', async () => {
    render(
      <Carousel i18n={i18n} slidesPerView={{ 640: 2 }} gap={{ 480: 20, 1024: 28 }}>
        <CarouselSlide>1</CarouselSlide>
        <CarouselSlide>2</CarouselSlide>
      </Carousel>,
    );
    await waitFor(() => expect((globalThis as any).__keenStore.opts?.breakpoints).toBeTruthy());
    const bps = (globalThis as any).__keenStore.opts.breakpoints;
    const toPx = (k: string) => parseInt(k.match(/\d+/)?.[0] || '0', 10);
    const sorted = Object.keys(bps).sort((a, b) => toPx(a) - toPx(b));
    expect(sorted).toEqual(['(min-width: 480px)', '(min-width: 640px)', '(min-width: 1024px)']);
    expect(bps['(min-width: 480px)'].slides.spacing).toBe(20);
    expect(bps['(min-width: 640px)'].slides.perView).toBe(2);
    expect(bps['(min-width: 1024px)'].slides.spacing).toBe(28);
  });
});
