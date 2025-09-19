import { Slot } from '@radix-ui/react-slot';
import { useKeenSlider } from 'keen-slider/react.es';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IconButton } from './IconButton';

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(' ');
}

type ResponsiveNumber = number | Record<number, number>;

type CarouselI18n = {
  label: string;
  previous: string;
  next: string;
  goTo: (index: number) => string;
  status: (current: number, total: number) => string;
};

type CarouselProps = {
  children: ReactNode;
  className?: string;
  slidesPerView?: ResponsiveNumber;
  gap?: ResponsiveNumber;
  bleedLeft?: ResponsiveNumber;
  bleedRight?: ResponsiveNumber;
  edgeLeft?: ResponsiveNumber;
  edgeRight?: ResponsiveNumber;
  nav?: boolean;
  dots?: boolean;
  i18n: CarouselI18n;
};

function resolveAt(v: ResponsiveNumber | undefined, width: number, fallback: number) {
  if (typeof v === 'number') return v;
  if (!v) return fallback;
  const pairs = Object.entries(v)
    .map(([k, val]) => [Number(k), Number(val)] as const)
    .sort((a, b) => a[0] - b[0]);
  let current = fallback;
  for (const [bp, val] of pairs) if (width >= bp) current = val;
  return current;
}

function buildBreakpoints(spv: ResponsiveNumber | undefined, gap: ResponsiveNumber | undefined) {
  const set = new Set<number>();
  if (typeof spv !== 'number' && spv) for (const k of Object.keys(spv)) set.add(Number(k));
  if (typeof gap !== 'number' && gap) for (const k of Object.keys(gap)) set.add(Number(k));
  const arr = Array.from(set).sort((a, b) => a - b);
  const obj: Record<string, any> = {};
  for (const bp of arr) {
    obj[`(min-width: ${bp}px)`] = {
      slides: {
        perView: resolveAt(spv, bp, 1),
        spacing: resolveAt(gap, bp, 16),
      },
    };
  }
  return obj;
}

export function Carousel({
  children,
  className,
  slidesPerView = 1,
  gap = 16,
  bleedLeft = 0,
  bleedRight = 0,
  edgeLeft = 0,
  edgeRight = 0,
  nav = true,
  dots = true,
  i18n,
}: CarouselProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [last, setLast] = useState(0);
  const [layout, setLayout] = useState({ bleedL: 0, bleedR: 0, edgeL: 0, edgeR: 0 });

  useEffect(() => setMounted(true), []);

  const scheduleUpdate = useRef<number | null>(null);
  const requestUpdate = useCallback(() => {
    const id = scheduleUpdate.current;
    if (id != null) cancelAnimationFrame(id);
    scheduleUpdate.current = requestAnimationFrame(() => {
      scheduleUpdate.current = null;
      instanceRef.current?.update();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      const id = scheduleUpdate.current;
      if (id != null) {
        cancelAnimationFrame(id);
        scheduleUpdate.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const w = e.contentRect.width;
        setLayout({
          bleedL: resolveAt(bleedLeft, w, 0),
          bleedR: resolveAt(bleedRight, w, 0),
          edgeL: resolveAt(edgeLeft, w, 0),
          edgeR: resolveAt(edgeRight, w, 0),
        });
      }
      requestUpdate();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [bleedLeft, bleedRight, edgeLeft, edgeRight, requestUpdate]);

  const baseSpv = resolveAt(slidesPerView, 0, 1);
  const baseGap = resolveAt(gap, 0, 16);
  const breakpoints = useMemo(() => buildBreakpoints(slidesPerView, gap), [slidesPerView, gap]);

  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const slidesCount = childrenArray.length;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    rubberband: false,
    slides: { perView: baseSpv, spacing: baseGap },
    breakpoints,
    created(s) {
      setCurrent(s.track.details.rel);
      setLast(s.track.details.maxIdx);
    },
    slideChanged(s) {
      setCurrent(s.track.details.rel);
      setLast(s.track.details.maxIdx);
    },
    detailsChanged(s) {
      setLast(s.track.details.maxIdx);
    },
    updated(s) {
      setCurrent(s.track.details.rel);
      setLast(s.track.details.maxIdx);
    },
  });

  useEffect(() => {
    if (!mounted) return;
    requestUpdate();
  }, [mounted, slidesCount, baseSpv, baseGap, breakpoints, requestUpdate]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const root = rootRef.current;
      if (!root) return;
      const active = document.activeElement as Element | null;
      if (!active || !root.contains(active)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        instanceRef.current?.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        instanceRef.current?.prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        instanceRef.current?.moveToIdx(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        instanceRef.current?.moveToIdx(last);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [last, instanceRef]);

  const dotsCount = Math.max(last + 1, slidesCount || 1);
  const showNav = nav && mounted && last > 0;
  const showDots = dots && dotsCount > 1;

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      style={
        {
          ['--bleed-left' as any]: `${layout.bleedL}px`,
          ['--bleed-right' as any]: `${layout.bleedR}px`,
          ['--edge-left' as any]: `${layout.edgeL}px`,
          ['--edge-right' as any]: `${layout.edgeR}px`,
        } as CSSProperties
      }
      role="region"
      aria-roledescription="carousel"
      aria-label={i18n.label}
    >
      <div
        className="relative overflow-visible"
        style={{
          width: 'calc(100% + var(--bleed-left) + var(--bleed-right))',
          marginLeft: 'calc(var(--bleed-left) * -1)',
          marginRight: 'calc(var(--bleed-right) * -1)',
        }}
      >
        {mounted ? (
          <div
            key={`${slidesCount}-${baseSpv}-${baseGap}`}
            ref={sliderRef}
            className="keen-slider"
            style={{ paddingLeft: 'var(--edge-left)', paddingRight: 'var(--edge-right)' }}
            aria-live="polite"
          >
            {childrenArray.map((child, i) => (
              <div key={i} className="keen-slider__slide">
                {child as ReactNode}
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid"
            style={{
              gridAutoFlow: 'column',
              gap: `${baseGap}px`,
              paddingLeft: 'var(--edge-left)',
              paddingRight: 'var(--edge-right)',
              overflow: 'hidden',
            }}
          >
            {childrenArray.map((child, i) => (
              <div key={i} className="w-full">
                {child as ReactNode}
              </div>
            ))}
          </div>
        )}
      </div>

      {showNav && (
        <>
          <IconButton
            type="button"
            variant="outline"
            aria-label={i18n.previous}
            onClick={() => instanceRef.current?.prev()}
            disabled={current === 0}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </IconButton>
          <IconButton
            type="button"
            variant="outline"
            aria-label={i18n.next}
            onClick={() => instanceRef.current?.next()}
            disabled={current >= last}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </IconButton>
        </>
      )}

      {showDots && (
        <div className="mt-4 flex justify-center">
          <div
            className="flex gap-2 rounded-full bg-neutral-0/20 p-2 backdrop-blur-sm"
            role="tablist"
            aria-label={i18n.label}
          >
            {Array.from({ length: dotsCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={i18n.goTo(i + 1)}
                onClick={() => mounted && instanceRef.current?.moveToIdx(i)}
                className={cn(
                  'h-2 w-2 rounded-full transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0',
                  i === current && mounted ? 'w-5 bg-primary-600' : 'bg-neutral-0',
                )}
              />
            ))}
          </div>
        </div>
      )}

      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {i18n.status(current + 1, dotsCount)}
      </span>
    </div>
  );
}

export function CarouselSlide({
  asChild,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'> & { asChild?: boolean }) {
  const Comp: ElementType = asChild ? Slot : 'div';
  return <Comp className={cn('w-full', className)} {...props} />;
}
