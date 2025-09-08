import { Brand } from '@nuvens/brand-ui';
import { Container } from '@nuvens/ui-core';
import { useLanguageOptions } from '~/lib/i18n/useLanguageOptions';
import { useStore } from '~/providers';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { CartButton } from './Cart';
import { HeaderMenu } from './HeaderMenu';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MenuButton } from './MenuButton';

export function Header() {
  const { header, publicStoreDomain } = useStore();
  const { options: languages, current } = useLanguageOptions();

  if (!header) return null;
  const { shop, menu } = header;

  return (
    <header className="relative isolate z-40 w-full bg-[var(--color-header-bg)] text-[var(--color-on-header)]">
      <Container className="flex h-16 items-center">
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
