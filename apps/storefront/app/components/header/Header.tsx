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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3">
        <div className="relative flex items-center gap-3">
          <div className="sm:hidden">
            <MenuButton />
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0">
            <LocalizedNavLink prefetch="intent" to="/" end aria-label="Home">
              <Brand />
            </LocalizedNavLink>
          </div>

          {menu?.items?.length ? (
            <div className="hidden sm:flex flex-1">
              <HeaderMenu
                menu={menu}
                primaryDomainUrl={shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>
          ) : (
            <div className="hidden sm:block flex-1" />
          )}

          <div className="ml-auto flex items-center gap-3">
            {languages.length > 0 ? (
              <LanguageSwitcher options={languages} current={current} />
            ) : null}
            <CartButton cart={cart} />
          </div>
        </div>
      </div>
    </header>
  );
}
