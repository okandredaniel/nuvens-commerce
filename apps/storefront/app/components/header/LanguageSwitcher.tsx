import { languageLabel } from '@/i18n/languageLabel';
import { toLang } from '@/i18n/localize';
import { brandDefaultLocale } from '@nuvens/brand-ui';
import { DropdownMenu, IconButton, Tooltip } from '@nuvens/ui';
import { Globe } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import type { LanguageOption } from './header.interfaces';

type Props = { options: LanguageOption[]; current?: string };

export function LanguageSwitcher({ options, current }: Props) {
  const { i18n, t } = useTranslation('common');
  const { pathname } = useLocation();

  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const pathLang = /^[a-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
  const defLang = toLang(String(brandDefaultLocale) || 'en');
  const effective = toLang(current) || pathLang || toLang(i18n.resolvedLanguage) || defLang;

  const idx = useMemo(
    () => (options?.length ? options.findIndex((o) => toLang(o.isoCode) === effective) : -1),
    [options, effective],
  );

  const active = useMemo(() => {
    if (!options?.length) return undefined;
    return idx >= 0
      ? options[idx]
      : options.find((o) => toLang(o.isoCode) === defLang) || options[0];
  }, [options, idx, defLang]);

  const others = useMemo(() => {
    if (!options?.length) return [];
    const activeIndex = idx >= 0 ? idx : active ? options.indexOf(active) : -1;
    return options.filter((_, i) => i !== activeIndex);
  }, [options, idx, active]);

  if (!options?.length || !active) return null;

  const labelChange = t('nav.changeLanguage');
  const activeLabel = languageLabel(active.isoCode, i18n.language, active.label);
  const a11yCurrent = t('a11y.current', {
    target: t('nav.language').toLowerCase(),
    value: activeLabel,
  });

  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger asChild>
            <IconButton
              aria-label={a11yCurrent}
              variant="outline"
              className="w-auto px-3 gap-2 uppercase text-xs font-semibold"
            >
              <Globe className="h-4 w-4 text-primary-400" aria-hidden />
              <span>{activeLabel}</span>
            </IconButton>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={8}>
            {labelChange}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      {others.length > 0 && (
        <DropdownMenu.Portal>
          <DropdownMenu.Content sideOffset={8}>
            <div className="px-3 py-2 text-xs uppercase opacity-60">{labelChange}</div>
            {others.map((o) => {
              const label = languageLabel(o.isoCode, i18n.language, o.label);
              return (
                <DropdownMenu.Item key={o.isoCode} asChild>
                  <NavLink
                    to={o.href}
                    prefetch="intent"
                    aria-label={t('nav.switchTo', { value: label })}
                  >
                    {t('nav.switchTo', { value: label })}
                  </NavLink>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      )}
    </DropdownMenu.Root>
  );
}
