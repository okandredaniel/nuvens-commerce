import { Button, DropdownMenu, Tooltip } from '@nuvens/ui';
import { Globe } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { useShopifyAdapter } from '../../adapter';
import { toLang } from '../../i18n/localize';
import type { LanguageOption } from '../../types/header.interfaces';

type Props = { options: LanguageOption[]; current?: string };

const storefrontCommonBundles = import.meta.glob('../../locales/**/common.json');
const loaded = new Set<string>();
const dnCache = new Map<string, Intl.DisplayNames | null>();

const endonymFallback: Record<string, Record<string, string>> = {
  en: { en: 'English', fr: 'French', pt: 'Portuguese', es: 'Spanish', it: 'Italian' },
  fr: { en: 'anglais', fr: 'français', pt: 'portugais', es: 'espagnol', it: 'italien' },
  pt: { en: 'inglês', fr: 'francês', pt: 'português', es: 'espanhol', it: 'italiano' },
  es: { en: 'inglés', fr: 'francés', pt: 'portugués', es: 'español', it: 'italiano' },
  it: { en: 'inglese', fr: 'francese', pt: 'portoghese', es: 'spagnolo', it: 'italiano' },
};

const switchToTemplate: Record<string, string> = {
  en: 'Switch to {{value}}',
  fr: 'Passer en {{value}}',
  pt: 'Mudar para {{value}}',
  es: 'Cambiar a {{value}}',
  it: 'Passare a {{value}}',
};

function endonym(codeRaw: string, displayLocaleRaw: string) {
  const code = toLang(codeRaw);
  const display = toLang(displayLocaleRaw);
  const key = `${display}::${code}`;
  let dn = dnCache.get(key);
  if (dn === undefined) {
    try {
      dn = new Intl.DisplayNames([display], { type: 'language' });
    } catch {
      dn = null;
    }
    dnCache.set(key, dn);
  }
  const name = dn ? dn.of(code) : undefined;
  if (name) return name;
  const map = endonymFallback[display] || endonymFallback.en;
  return map[code] || code;
}

function tSwitchTo(i18n: import('i18next').i18n, target: string, langName: string) {
  const lng = toLang(target);
  const exists = !!i18n.getResource(lng, 'common', 'nav.switchTo');
  if (exists) return i18n.getFixedT(lng, 'common')('nav.switchTo', { value: langName });
  const tpl = switchToTemplate[lng] || switchToTemplate.en;
  return tpl.replace('{{value}}', langName);
}

async function ensureBundle(i18n: import('i18next').i18n, lang: string) {
  const lng = toLang(lang);
  if (
    loaded.has(lng) ||
    (typeof i18n.hasResourceBundle === 'function' && i18n.hasResourceBundle(lng, 'common'))
  ) {
    loaded.add(lng);
    return;
  }
  const matcher = new RegExp(`/locales/${lng}/common\\.json$`);
  const entry = Object.entries(storefrontCommonBundles).find(([p]) =>
    matcher.test(p.replace(/\\/g, '/')),
  );
  if (entry) {
    const [, loader] = entry;
    const mod = (await loader()) as any;
    const json = mod.default || mod;
    i18n.addResourceBundle(lng, 'common', json, true, true);
    loaded.add(lng);
  }
}

function labelForTarget(i18n: import('i18next').i18n, target: string) {
  if (toLang(target) === 'en') return tSwitchTo(i18n, target, 'ENGLISH');
  const name = endonym(target, target);
  return tSwitchTo(i18n, target, name);
}

export function LanguageSwitcher({ options, current }: Props) {
  const { defaultLocale } = useShopifyAdapter();
  const { i18n, t } = useTranslation('common');
  const { pathname } = useLocation();
  const [ready, setReady] = useState(0);

  const seg = pathname.split('/').filter(Boolean)[0] ?? '';
  const pathLang = /^[a-z]{2}$/i.test(seg) ? seg.toLowerCase() : undefined;
  const defLang = toLang(defaultLocale);
  const currentNorm = current ? toLang(current) : undefined;
  const resolvedNorm = i18n.resolvedLanguage ? toLang(i18n.resolvedLanguage) : undefined;
  const effective = pathLang || currentNorm || resolvedNorm || defLang;

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

  useEffect(() => {
    const langs = others.map((o) => toLang(o.isoCode));
    Promise.all(langs.map((l) => ensureBundle(i18n, l))).then(() => setReady((x) => x + 1));
  }, [i18n, others]);

  if (!options?.length || !active) return null;

  const labelChange = t('nav.changeLanguage');
  const activeLabel = endonym(active.isoCode, active.isoCode);
  const a11yCurrent = t('a11y.current', {
    target: t('nav.language').toLowerCase(),
    value: activeLabel,
  });

  return (
    <DropdownMenu.Root data-testid="dm-root">
      <Tooltip.Root data-testid="tt-root">
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger asChild>
            <Button
              aria-label={a11yCurrent}
              variant="outline"
              surface="dark"
              className="w-full max-w-12 md:max-w-none"
              data-testid="btn"
            >
              <Globe className="h-4 w-4 text-primary-400 mr-2" aria-hidden />
              <span>{toLang(active.isoCode).toUpperCase()}</span>
            </Button>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={8} data-testid="tt-content">
            {labelChange}
            <Tooltip.Arrow data-testid="tt-arrow" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      {others.length > 0 && (
        <DropdownMenu.Portal data-testid="dm-portal">
          <DropdownMenu.Content sideOffset={8} data-testid="dm-content">
            <div className="px-3 py-2 text-xs uppercase opacity-60">{labelChange}</div>
            {others.map((o) => {
              const target = toLang(o.isoCode);
              const label = labelForTarget(i18n, target);
              return (
                <DropdownMenu.Item key={o.isoCode} asChild>
                  <NavLink to={o.href} prefetch="none" aria-label={label}>
                    {label}
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
