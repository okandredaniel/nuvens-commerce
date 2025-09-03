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
    <header className="w-full px-4 sm:px-6 py-3 bg-indigo-900 text-white">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="hidden xs:flex items-center gap-3">
          <MenuButton />
        </div>

        <div className="flex justify-center">
          <LocalizedNavLink prefetch="intent" to="/" end>
            <Brand />
          </LocalizedNavLink>
        </div>

        {menu?.items?.length ? (
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        ) : null}

        <div className="flex items-center justify-end gap-3">
          {languages.length > 0 ? <LanguageSwitcher options={languages} current={current} /> : null}
          <CartButton cart={cart} />
        </div>
      </div>
    </header>
  );
}
