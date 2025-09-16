import { Button, Container, Heading, Link } from '@nuvens/ui';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar } from 'react-icons/fa';
import heroImageUrl from './assets/zippex-hero-couple.png';
import heroPatternUrl from './assets/seamless-wavy-line-pattern.webp';

export function Hero() {
  const { t } = useTranslation('zippex-hero');
  const [imgY, setImgY] = useState(0);
  const [titleY, setTitleY] = useState(0);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        setImgY(y * 0.6);
        setTitleY(y * 0.25);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      aria-labelledby="hero-title"
      className="
        text-[color:var(--color-on-primary)]
        bg-gradient-to-r
        from-[color:var(--palette-neutral-600)]
        to-[color:var(--palette-primary-600)]
        w-full overflow-hidden
        relative
      "
    >
      <div
        className="absolute t-0 l-0 w-full h-full z-0 mix-blend-difference opacity-25"
        style={{
          backgroundImage: `url(${heroPatternUrl})`,
        }}
      />
      <Container className="pt-32 pb-16 md:py-16 md:pt-40 md:pb-20">
        <div className="relative flex flex-col items-center gap-6">
          <Heading
            as="h1"
            id="hero-title"
            className="text-3xl md:text-8xl will-change-transform -mb-14 sm:-mb-24 text-center text-inherit"
            style={{ transform: `translateY(-${titleY}px)` }}
          >
            {t('title')}
          </Heading>

          <div className="flex flex-col items-center gap-6" style={{ marginTop: `-${imgY}px` }}>
            <div className="-mx-8 md:mx-0">
              <img
                src={heroImageUrl}
                alt={t('imageAlt')}
                className="w-full h-80 md:h-auto max-w-[1500px] pointer-events-none relative z-10 will-change-transform object-cover"
                loading="eager"
                decoding="sync"
              />
            </div>
            <div className="flex items-center gap-4 -mt-12">
              <div className="inline-flex gap-1">
                <FaStar className="h-5 w-5" aria-hidden />
                <FaStar className="h-5 w-5" aria-hidden />
                <FaStar className="h-5 w-5" aria-hidden />
                <FaStar className="h-5 w-5" aria-hidden />
                <FaStar className="h-5 w-5" aria-hidden />
              </div>
              <span>{t('rating.text')}</span>
            </div>

            <Button variant="white" size="lg" asChild>
              <Link to="/products/matelas-zippex">{t('cta')}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
