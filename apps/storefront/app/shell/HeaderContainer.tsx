import { useStore } from '@/providers/AppContexts';
import { Header } from '@nuvens/shopify';

export function HeaderContainer({
  headerPref,
  Brand,
}: {
  headerPref?: 'transparent' | 'solid';
  Brand: React.ElementType;
}) {
  const store = useStore();
  const headerData = store?.header ?? null;
  const publicStoreDomain = (store?.publicStoreDomain as string) || '';
  const primaryDomainUrl = headerData?.shop?.primaryDomain?.url || '';
  return (
    <Header
      pref={headerPref}
      Brand={Brand}
      menu={headerData?.menu}
      primaryDomainUrl={primaryDomainUrl}
      publicStoreDomain={publicStoreDomain}
    />
  );
}
