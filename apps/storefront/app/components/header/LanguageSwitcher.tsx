import { brandDefaultLocale } from '@nuvens/brand-ui';
import { Dropdown } from '@nuvens/ui-core';
import { Globe } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

  const activeLabel = languageLabel(active.isoCode, i18n.language, active.label);

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className="inline-flex items-center gap-2 px-3 h-10 rounded-full text-xs font-semibold uppercase border border-zinc-300 bg-white/10 hover:bg-white/20 transition"
        aria-label={t('nav.changeLanguage')}
        title={t('nav.currentLanguage', { lang: activeLabel })}
      >
        <Globe className="h-4 w-4 text-sky-400" aria-hidden />
        <span>{activeLabel}</span>
      </Dropdown.Trigger>
      {others.length > 0 && (
        <Dropdown.Content>
          <Dropdown.Label className="px-3 py-2 text-xs uppercase opacity-60">
            {t('nav.changeLanguage')}
          </Dropdown.Label>
          {others.map((o) => {
            const label = languageLabel(o.isoCode, i18n.language, o.label);
            return (
              <Dropdown.Item key={o.isoCode} asChild>
                <NavLink
                  to={o.href}
                  prefetch="intent"
                  aria-label={t('nav.switchTo', { lang: label })}
                  className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-zinc-100"
                >
                  {t('nav.switchTo', { lang: label })}
                </NavLink>
              </Dropdown.Item>
            );
          })}
        </Dropdown.Content>
      )}
    </Dropdown.Root>
  );
}
