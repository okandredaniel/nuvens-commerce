import { NavLink } from 'react-router';
import { LanguageOption } from './header.interfaces';

export function LanguageSwitcher({ options }: { options: LanguageOption[] }) {
  if (!options?.length) return null;

  const [current, ...others] = options;

  return (
    <div className="relative">
      <NavLink
        to={current.href}
        prefetch="intent"
        aria-label="Change language"
        className="inline-grid place-items-center size-10 rounded-full text-xs font-semibold uppercase border-1 border-zinc-300"
      >
        {current.label ?? current.isoCode}
      </NavLink>

      {others.length > 0 ? null : null}
    </div>
  );
}
