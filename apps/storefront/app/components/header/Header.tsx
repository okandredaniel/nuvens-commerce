import { Brand } from '@nuvens/brand-ui';
import { NavLink, useRouteLoaderData } from 'react-router';
import type { RootLoader } from '~/root';
import { CartButton } from './Cart';
import type { HeaderProps, LanguageOption } from './header.interfaces';
import { HeaderMenu } from './HeaderMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuButton } from './MenuButton';

export function Header({ header, cart, publicStoreDomain }: HeaderProps) {
  const { shop, menu } = header;
  const data = useRouteLoaderData<RootLoader>('root');

  const languages = (data as unknown as { languages?: LanguageOption[] })?.languages;

  return (
    <header className="w-full px-4 sm:px-6 py-3 bg-zinc-400">
      <div className="mx-auto max-w-7xl grid grid-cols-4 items-center">
        <div className="flex items-center gap-3">
          <MenuButton />
        </div>

        <div className="flex justify-center">
          <NavLink prefetch="intent" to="/" end className="inline-flex items-center gap-2">
            <Brand />
          </NavLink>
        </div>

        {menu?.items?.length ? (
          <HeaderMenu
            menu={menu}
            viewport="desktop"
            primaryDomainUrl={header.shop.primaryDomain.url}
            publicStoreDomain={publicStoreDomain}
          />
        ) : null}

        <div className="flex items-center justify-end gap-3">
          {languages && languages.length > 0 ? <LanguageSwitcher options={languages} /> : null}
          <CartButton cart={cart} />
        </div>
      </div>
    </header>
  );
}
