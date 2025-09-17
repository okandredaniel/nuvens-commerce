import { Aside } from '@nuvens/ui';
import { useStore } from '~/providers/AppContexts';
import { HeaderMenu } from './header';

export function MobileMenuAside() {
  const { header, publicStoreDomain } = useStore();
  if (!header?.menu || !header.shop?.primaryDomain?.url || !publicStoreDomain) return null;

  return (
    <Aside type="mobile" heading="MENU">
      <HeaderMenu
        menu={header.menu}
        primaryDomainUrl={header.shop.primaryDomain.url}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside>
  );
}
