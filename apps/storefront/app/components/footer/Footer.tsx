import { Brand } from '@nuvens/brand-ui';
import { Container } from '@nuvens/ui-core';
import { Suspense } from 'react';
import { Await } from 'react-router';
import type { FooterQuery } from 'storefrontapi.generated';
import { Newsletter } from '~/components/Newsletter';
import { useStore } from '~/providers';
import { LocalizedNavLink } from '../LocalizedNavLink';
import { FooterMenuColumns } from './FooterMenuColumns';
import { FooterPayments } from './FooterPayments';

export function Footer() {
  const { footer, publicStoreDomain, primaryDomainUrl } = useStore();
  if (!footer) return null;

  return (
    <footer className="mt-auto bg-[color:var(--color-footer-bg)] text-[color:var(--color-on-footer)]">
      <section className="bg-[color:var(--color-footer-section)]">
        <Container className="py-12 md:py-16">
          <Newsletter />
        </Container>
      </section>

      <Suspense fallback={null}>
        <Await resolve={footer}>
          {(data: FooterQuery | null) => {
            const menu = data?.menu;
            if (!menu || !menu.items?.length) return null;

            return (
              <>
                <section className="border-t border-[color:var(--color-on-footer)]/10">
                  <Container className="py-8">
                    <FooterPayments />
                  </Container>
                </section>

                <section className="border-t border-[color:var(--color-on-footer)]/10">
                  <Container className="py-10 md:py-12">
                    <FooterMenuColumns
                      menu={menu}
                      primaryDomainUrl={primaryDomainUrl}
                      publicStoreDomain={publicStoreDomain}
                    />
                  </Container>
                </section>
              </>
            );
          }}
        </Await>
      </Suspense>

      <section className="border-t border-[color:var(--color-on-footer)]/10">
        <Container className="py-8">
          <LocalizedNavLink prefetch="intent" to="/" end aria-label="Home">
            <Brand />
          </LocalizedNavLink>
        </Container>
      </section>
    </footer>
  );
}
