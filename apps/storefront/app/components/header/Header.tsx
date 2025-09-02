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

  const ring = data?.brand?.tokens?.colors?.ring ?? '#A8B2BC';
  const fg = data?.brand?.tokens?.colors?.headerFg ?? '#ffffff';
  const bg = data?.brand?.tokens?.colors?.headerBg ?? 'transparent';

  const languages = (data as unknown as { languages?: LanguageOption[] })?.languages;

  return (
    <header className="w-full px-4 sm:px-6 py-3" style={{ background: bg, color: fg }}>
      <div className="mx-auto max-w-7xl grid grid-cols-3 items-center">
        <div className="flex items-center gap-3">
          <MenuButton ring={ring} />
        </div>

        <div className="flex justify-center">
          <NavLink prefetch="intent" to="/" end className="inline-flex items-center gap-2">
            <strong className="text-2xl font-extrabold tracking-tight">{shop.name}</strong>
          </NavLink>
        </div>

        <div className="flex items-center justify-end gap-3">
          {languages && languages.length > 0 ? (
            <LanguageSwitcher ring={ring} options={languages} />
          ) : null}
          <CartButton cart={cart} ring={ring} />
        </div>
      </div>

      {menu?.items?.length ? (
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      ) : null}
    </header>
  );
}
