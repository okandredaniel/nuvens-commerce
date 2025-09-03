import { brandDefaultLocale } from '@nuvens/brand-ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaGlobeAmericas } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router';
import { languageLabel, toLang } from '~/lib/i18n';
import type { LanguageOption } from './header.interfaces';

type Props = { options: LanguageOption[]; current?: string };

export function LanguageSwitcher({ options, current }: Props) {
  const { i18n, t } = useTranslation('common');
  const { pathname } = useLocation();
  if (!options?.length) return null;

  const pathSeg = pathname.split('/').filter(Boolean)[0] ?? '';
  const pathLang = /^[a-z]{2}$/i.test(pathSeg) ? pathSeg.toLowerCase() : undefined;
  const defaultLang = toLang(String(brandDefaultLocale) || 'en');
  const effectiveCurrent =
    toLang(current) || pathLang || toLang(i18n.resolvedLanguage) || defaultLang;

  const idx = useMemo(
    () => options.findIndex((o) => toLang(o.isoCode) === effectiveCurrent),
    [options, effectiveCurrent],
  );

  const active =
    idx >= 0 ? options[idx] : options.find((o) => toLang(o.isoCode) === defaultLang) || options[0];
  const others = useMemo(
    () => options.filter((_, i) => i !== (idx >= 0 ? idx : options.indexOf(active))),
    [options, idx, active],
  );

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const activeLabel = languageLabel(active.isoCode, i18n.language, active.label);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('nav.changeLanguage')}
        title={t('nav.currentLanguage', { lang: activeLabel })}
        className="inline-flex items-center gap-2 px-3 h-10 rounded-full text-xs font-semibold uppercase border border-zinc-300 bg-white/10 hover:bg-white/20 transition"
      >
        <FaGlobeAmericas className="text-sky-400" aria-hidden />
        <span>{activeLabel}</span>
      </button>

      {open && others.length > 0 ? (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 min-w-40 rounded-xl border border-zinc-200 bg-white shadow-lg p-1 z-20"
        >
          {others.map((o) => {
            const label = languageLabel(o.isoCode, i18n.language, o.label);
            return (
              <li key={o.isoCode}>
                <NavLink
                  to={o.href}
                  prefetch="intent"
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-zinc-100"
                  onClick={() => setOpen(false)}
                  aria-label={t('nav.switchTo', { lang: label })}
                >
                  {t('nav.switchTo', { lang: label })}
                </NavLink>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
