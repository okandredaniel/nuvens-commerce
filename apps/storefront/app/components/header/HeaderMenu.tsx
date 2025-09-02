import { NavLink } from 'react-router';
import { useAside } from '~/components/Aside';
import { HeaderProps, Viewport } from './header.interfaces';

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  if (!menu?.items?.length) return null;

  const wrapper =
    viewport === 'desktop' ? 'hidden md:flex gap-6 justify-center' : 'flex flex-col gap-4';

  const { close } = useAside();

  return (
    <nav className={wrapper} role="navigation">
      {menu.items.map((item) => {
        if (!item?.id || !item?.title || !item?.url) return null;

        const isInternal =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl);

        const url = isInternal ? new URL(item.url).pathname : item.url;

        return (
          <NavLink
            className="text-sm md:text-base hover:opacity-80 transition-opacity"
            prefetch="intent"
            onClick={close}
            key={item.id}
            to={url}
            end
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}
