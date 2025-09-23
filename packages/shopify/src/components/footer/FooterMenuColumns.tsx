import { cn } from '@nuvens/ui';
import { isExternal } from '../../i18n/localize';
import { type FooterQuery } from '../../types/storefrontapi.generated';
import { LocalizedNavLink } from '../LocalizedNavLink';

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

export function FooterMenuColumns({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: FooterQuery['menu'];
  primaryDomainUrl?: string;
  publicStoreDomain?: string;
}) {
  const groups = (menu?.items ?? []).filter(Boolean);

  return (
    <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
      {groups.map((group) => {
        const children = (group.items ?? []).filter(Boolean);
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
