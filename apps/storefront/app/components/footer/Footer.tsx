import { Newsletter } from '@/components/Newsletter';
import { useStore } from '@/providers/AppContexts';
import { Brand } from '@nuvens/brand-ui';
import { Container } from '@nuvens/ui';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Await } from 'react-router';
import type { FooterQuery } from 'storefrontapi.generated';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { FooterMenuColumns } from './FooterMenuColumns';
import { FooterPayments } from './FooterPayments';

export function Footer() {
  const { t } = useTranslation('common');
  const { footer, publicStoreDomain, primaryDomainUrl, header } = useStore();
  if (!footer) return null;

  const brandName = header?.shop?.name || '';
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-primary-600 text-neutral-0">
      <div className="bg-primary-900/20 py-12 md:py-16">
        <Container>
          <Newsletter />
        </Container>
      </div>

      <Container className="max-w-[120rem]">
        <Suspense fallback={null}>
          <Await resolve={footer}>
            {(data: FooterQuery | null) => {
              const menu = data?.menu;
              if (!menu || !menu.items?.length) return null;

              return (
                <div className="py-8">
                  <FooterMenuColumns
                    menu={menu}
                    primaryDomainUrl={primaryDomainUrl}
                    publicStoreDomain={publicStoreDomain}
                  />
                </div>
              );
            }}
          </Await>
        </Suspense>

        <div className="grid items-end gap-6 border-t border-neutral-0/10 py-8 md:grid-cols-3 md:flex-row md:gap-8">
          <div className="text-center">
            <LocalizedNavLink prefetch="intent" to="/" end aria-label="Home">
              <Brand />
            </LocalizedNavLink>
          </div>

          <div className="text-center text-sm opacity-70">
            {t('copyright', {
              year,
              brand: brandName,
            })}
          </div>

          <FooterPayments />
        </div>
      </Container>
    </footer>
  );
}
