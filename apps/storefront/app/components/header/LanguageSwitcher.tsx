import { NavLink } from 'react-router';
import { LanguageOption } from './header.interfaces';

export function LanguageSwitcher({ ring, options }: { ring: string; options: LanguageOption[] }) {
  if (!options?.length) return null;

  const [current, ...others] = options;

  return (
    <div className="relative">
      <NavLink
        to={current.href}
        prefetch="intent"
        aria-label="Change language"
        className="inline-grid place-items-center size-10 rounded-full text-xs font-semibold uppercase"
        style={{ border: `2px solid ${ring}` }}
      >
        {current.label ?? current.isoCode}
      </NavLink>

      {others.length > 0 ? null : null}
    </div>
  );
}
