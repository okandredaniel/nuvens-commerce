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
            <footer className="footer">
              <FooterMenu
                menu={menu}
                publicStoreDomain={publicStoreDomain}
                primaryDomainUrl={primaryDomainUrl}
              />
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
    <nav className="footer-menu" role="navigation">
      {menu.items.map((item) => {
        if (!item.url) return null;

        const href = toPath(item.url, primaryDomainUrl, publicStoreDomain);
        const isExternal =
          /^https?:\/\//i.test(href) ||
          href.startsWith('mailto:') ||
          href.startsWith('tel:') ||
          href.startsWith('#') ||
          !href.startsWith('/');

        return isExternal ? (
          <a href={href} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <LocalizedNavLink end key={item.id} prefetch="intent" to={href} style={activeLinkStyle}>
            {item.title}
          </LocalizedNavLink>
        );
      })}
    </nav>
  );
}

function activeLinkStyle({ isActive, isPending }: { isActive: boolean; isPending: boolean }) {
  return { fontWeight: isActive ? 'bold' : undefined, color: isPending ? 'grey' : 'white' };
}
