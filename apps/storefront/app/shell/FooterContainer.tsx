import { useStore } from '@/providers/AppContexts';
import { Footer } from '@nuvens/shopify';
import { useEffect, useState } from 'react';

export function FooterContainer({ Brand }: { Brand: React.ElementType }) {
  const store = useStore();
  const footerPromise = store?.footer as any;
  const headerData = store?.header ?? null;
  const publicStoreDomain = (store?.publicStoreDomain as string) || '';
  const primaryDomainUrl = headerData?.shop?.primaryDomain?.url || '';

  const [footerData, setFooterData] = useState<any>(null);
  useEffect(() => {
    let cancelled = false;
    const v: any = footerPromise;
    if (v && typeof v.then === 'function') {
      v.then((d: any) => {
        if (!cancelled) setFooterData(d ?? null);
      });
    } else {
      setFooterData(v ?? null);
    }
    return () => {
      cancelled = true;
    };
  }, [footerPromise]);

  return (
    <Footer
      Brand={Brand}
      brandName={headerData?.shop?.name || ''}
      year={new Date().getFullYear()}
      menu={footerData?.menu ?? null}
      primaryDomainUrl={primaryDomainUrl}
      publicStoreDomain={publicStoreDomain}
    />
  );
}
