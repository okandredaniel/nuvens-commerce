import { Container } from '@nuvens/ui';
import { type ElementType, useEffect, useRef, useState } from 'react';
import { useLanguageOptions } from '../../i18n/useLanguageOptions';
import { type HeaderQuery } from '../../types/storefrontapi.generated';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { CartButton } from './Cart';
import { HeaderMenu } from './HeaderMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuButton } from './MenuButton';

type HeaderPref = 'transparent' | 'solid';

type HeaderProps = {
  Brand: ElementType;
  pref?: HeaderPref;
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
};

export function Header({ pref, Brand, menu, primaryDomainUrl, publicStoreDomain }: HeaderProps) {
  const { options: languages, current } = useLanguageOptions();

  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastYRef = useRef(0);

  useEffect(() => {
    const readY = () =>
      typeof window !== 'undefined'
        ? (Number.isFinite(window.scrollY) ? window.scrollY : window.pageYOffset) || 0
        : 0;

    const applyFrom = (y: number) => {
      const last = lastYRef.current;
      const delta = y - last;
      const threshold = 6;
      if (Math.abs(delta) > threshold) {
        setVisible(delta < 0 || y < 80);
        lastYRef.current = y;
      }
      setScrolled(y > 100);
    };

    const initialY = readY();
    lastYRef.current = initialY;
    applyFrom(initialY);

    const onScroll = () => {
      applyFrom(readY());
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const baseTransparent = pref === 'transparent';
  const bgClass = scrolled || !baseTransparent ? 'bg-primary-600' : 'bg-transparent';

  return (
    <header
      className={[
        'fixed top-0 isolate z-40 w-full',
        'text-neutral-0',
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

        <div className="hidden flex-1 md:flex">
          <HeaderMenu
            menu={menu}
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
          />
        </div>

        <div className="md:ml-auto flex items-center gap-3">
          {languages.length > 0 ? <LanguageSwitcher options={languages} current={current} /> : null}
          <CartButton />
        </div>
      </Container>
    </header>
  );
}
