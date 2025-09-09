import { Brand } from '@nuvens/brand-ui';
import { Container } from '@nuvens/ui-core';
import { useEffect, useRef, useState } from 'react';
import { useLanguageOptions } from '~/lib/i18n/useLanguageOptions';
import { useStore } from '~/providers';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { CartButton } from './Cart';
import { HeaderMenu } from './HeaderMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuButton } from './MenuButton';

type HeaderPref = 'transparent' | 'solid';

export function Header({ pref }: { pref?: HeaderPref }) {
  const { header, publicStoreDomain } = useStore();
  const { options: languages, current } = useLanguageOptions();

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const last = lastYRef.current;
          const delta = y - last;
          const threshold = 6;
          if (Math.abs(delta) > threshold) {
            setVisible(delta < 0 || y < 80);
            lastYRef.current = y;
          }
          setScrolled(y > 100);
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };
    lastYRef.current = window.scrollY || 0;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!header) return null;
  const { shop, menu } = header;

  const baseTransparent = pref === 'transparent';
  const bgClass = scrolled
    ? 'bg-[color:var(--color-header-bg)]'
    : baseTransparent
      ? 'bg-transparent'
      : 'bg-[color:var(--color-header-bg)]';

  return (
    <header
      className={[
        'fixed top-0 isolate z-40 w-full text-[var(--color-on-header)]',
        'transition-colors duration-200 will-change-transform',
        'transform transition-transform duration-300',
        visible ? 'translate-y-0' : '-translate-y-full',
        bgClass,
      ].join(' ')}
    >
      <Container className="flex h-16 items-center max-w-[120rem]">
        <div className="md:hidden">
          <MenuButton />
        </div>

        <LocalizedNavLink prefetch="intent" to="/" end aria-label="Home" className="m-auto">
          <Brand />
        </LocalizedNavLink>

        {menu?.items?.length ? (
          <div className="hidden flex-1 md:flex">
            <HeaderMenu
              menu={menu}
              primaryDomainUrl={shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain as string}
            />
          </div>
        ) : (
          <div className="hidden flex-1 md:block" />
        )}

        <div className="md:ml-auto flex items-center gap-3">
          {languages.length > 0 ? <LanguageSwitcher options={languages} current={current} /> : null}
          <CartButton />
        </div>
      </Container>
    </header>
  );
}
