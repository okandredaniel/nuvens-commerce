import { Container } from '@nuvens/ui';
import { type ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { Newsletter } from '../Newsletter';
import { FooterMenuColumns } from './FooterMenuColumns';
import { FooterPayments } from './FooterPayments';

type FooterProps = {
  Brand: ElementType;
  brandName: string;
  year: number;
  menu: any | null;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
};

export function Footer({
  Brand,
  brandName,
  year,
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: FooterProps) {
  const { t } = useTranslation('common');

  return (
    <footer className="mt-auto bg-primary-600 text-neutral-0">
      <div className="bg-primary-900/20 py-12 md:py-16">
        <Container>
          <Newsletter />
        </Container>
      </div>

      <Container className="max-w-[120rem]">
        <div className="py-8">
          {menu?.items?.length ? (
            <FooterMenuColumns
              menu={menu}
              primaryDomainUrl={primaryDomainUrl}
              publicStoreDomain={publicStoreDomain}
            />
          ) : null}
        </div>

        <div className="grid items-end gap-6 border-t border-neutral-0/10 py-8 md:grid-cols-3 md:flex-row md:gap-8">
          <div className="text-center md:text-left">
            <LocalizedNavLink prefetch="none" to="/" aria-label="Home">
              <Brand />
            </LocalizedNavLink>
          </div>

          <div className="text-center text-sm opacity-70">
            {t('copyright', { year, brand: brandName })}
          </div>

          <FooterPayments />
        </div>
      </Container>
    </footer>
  );
}
