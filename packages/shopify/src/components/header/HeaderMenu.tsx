import { useAside } from '@nuvens/ui';
import { type HeaderQuery } from '../../types/storefrontapi.generated';
import { LocalizedNavLink } from '../LocalizedNavLink';

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
}: {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  publicStoreDomain: string;
}) {
  const { close } = useAside();

  if (!menu?.items?.length) return null;

  return (
    <nav className="w-full" role="navigation" aria-label="Main">
      <ul className="mx-auto flex flex-col items-start gap-4 md:items-center md:flex-row md:justify-center md:gap-6">
        {menu.items.map((item) => {
          if (!item?.id || !item?.title || !item?.url) return null;

          const isInternal =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl);

          if (isInternal) {
            const url = new URL(item.url).pathname;
            return (
              <li key={item.id}>
                <LocalizedNavLink
                  prefetch="intent"
                  onClick={close}
                  to={url}
                  end
                  className="px-2 py-1 md:text-base hover:opacity-80 transition-opacity"
                >
                  {item.title}
                </LocalizedNavLink>
              </li>
            );
          }

          return (
            <li key={item.id}>
              <a
                href={item.url}
                className="px-2 py-1 md:text-base hover:opacity-80 transition-opacity"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
