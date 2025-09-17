import { LocalizedNavLink } from '@/components/LocalizedNavLink';
import { cn } from '@nuvens/ui';
import type { FooterQuery } from 'storefrontapi.generated';

type Menu = NonNullable<FooterQuery['menu']>;
type Item = NonNullable<Menu['items']>[number];

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

function isExternal(href: string) {
  return (
    /^https?:\/\//i.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#') ||
    !href.startsWith('/')
  );
}

export function FooterMenuColumns({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: Menu;
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}) {
  const groups = (menu.items ?? []).filter(Boolean) as Item[];

  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {groups.map((group) => {
        const children = (group.items ?? []).filter(Boolean) as Item[];
        return (
          <div key={group.id} className="space-y-4">
            <h4 className="text-lg font-semibold">{group.title}</h4>
            <ul className="space-y-3">
              {children.map((child) => {
                if (!child?.url) return null;
                const href = toPath(child.url, primaryDomainUrl, publicStoreDomain);
                const base =
                  'text-[color:var(--color-on-footer)]/80 hover:text-[color:var(--color-on-footer)] transition-colors';
                return (
                  <li key={child.id}>
                    {isExternal(href) ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={base}>
                        {child.title}
                      </a>
                    ) : (
                      <LocalizedNavLink to={href} className={cn(base)} prefetch="intent" end>
                        {child.title}
                      </LocalizedNavLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
