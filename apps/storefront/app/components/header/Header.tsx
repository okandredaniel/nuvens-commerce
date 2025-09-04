import { Brand } from '@nuvens/brand-ui';
import { useLanguageOptions } from '~/lib/i18n/useLanguageOptions';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { CartButton } from './Cart';
import type { HeaderProps } from './header.interfaces';
import { HeaderMenu } from './HeaderMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuButton } from './MenuButton';

export function Header({ header, cart, publicStoreDomain }: HeaderProps) {
  const { shop, menu } = header;
  const { options: languages, current } = useLanguageOptions();

  return (
    <header className="relative isolate z-40 w-full bg-[var(--color-header-bg,#111)] text-[var(--color-on-header,#fff)]">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex sm:hidden items-center">
          <MenuButton />
        </div>
        <div className="hidden sm:flex w-10" />
        <div className="flex justify-center">
          <LocalizedNavLink prefetch="intent" to="/" end aria-label="Home">
            <Brand />
          </LocalizedNavLink>
        </div>
        {menu?.items?.length ? (
          <div className="hidden sm:block">
            <HeaderMenu
              menu={menu}
              viewport="desktop"
              primaryDomainUrl={shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
            />
          </div>
        ) : (
          <div className="hidden sm:block w-10" />
        )}
        <div className="flex items-center justify-end gap-3">
          {languages.length > 0 ? <LanguageSwitcher options={languages} current={current} /> : null}
          <CartButton cart={cart} />
        </div>
      </div>
    </header>
  );
}
