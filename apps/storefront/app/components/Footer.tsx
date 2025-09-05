import { Container, cn } from '@nuvens/ui-core';
import { Suspense } from 'react';
import { Await } from 'react-router';
import type { FooterQuery } from 'storefrontapi.generated';
import { LocalizedNavLink } from '~/components/LocalizedNavLink';

interface FooterProps {
  footer?: Promise<FooterQuery | null>;
  publicStoreDomain?: string;
  primaryDomainUrl?: string;
  fallback?: React.ReactNode;
}

export function Footer({
  footer,
  publicStoreDomain,
  primaryDomainUrl,
  fallback = null,
}: FooterProps) {
  if (!footer) return null;

  return (
    <Suspense fallback={fallback}>
      <Await resolve={footer}>
        {(data) => {
          const menu = data?.menu;
          if (!menu || !menu.items?.length) return null;

          return (
            <footer className="mt-auto bg-[color:var(--color-footer-bg)] text-[color:var(--color-on-footer)]">
              <Container className="py-6 md:py-10">
                <FooterMenu
                  menu={menu}
                  publicStoreDomain={publicStoreDomain}
                  primaryDomainUrl={primaryDomainUrl}
                />
              </Container>
            </footer>
          );
        }}
      </Await>
    </Suspense>
  );
}

function toPath(url: string, primaryDomainUrl?: string, publicStoreDomain?: string) {
  try {
    const u = new URL(url);
    const host = u.host.toLowerCase();
    const isPrimary = primaryDomainUrl && host === new URL(primaryDomainUrl).host.toLowerCase();
    const isPublic = publicStoreDomain && host.includes(publicStoreDomain.toLowerCase());
    const isShopify = host.includes('myshopify.com');
    return isPrimary || isPublic || isShopify ? `${u.pathname}${u.search}` : url;
  } catch {
    return url;
  }
}

function FooterMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: NonNullable<FooterQuery['menu']>;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}) {
  return (
    <nav role="navigation" aria-label="Footer">
      <ul className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {menu.items.map((item) => {
          if (!item?.url) return null;

          const href = toPath(item.url, primaryDomainUrl, publicStoreDomain);
          const isExternal =
            /^https?:\/\//i.test(href) ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#') ||
            !href.startsWith('/');

          const baseLink =
            'min-w-fit text-sm transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-footer-bg)]';

          return (
            <li key={item.id}>
              {isExternal ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={baseLink}>
                  {item.title}
                </a>
              ) : (
                <LocalizedNavLink
                  to={href}
                  end
                  prefetch="intent"
                  className={({ isActive, isPending }) =>
                    cn(baseLink, isActive && 'font-semibold', isPending && 'opacity-70')
                  }
                >
                  {item.title}
                </LocalizedNavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
