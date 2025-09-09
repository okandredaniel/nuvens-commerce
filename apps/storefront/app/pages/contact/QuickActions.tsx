import { Button } from '@nuvens/ui-core';
import { HelpCircle, RefreshCw, Search, type LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type Tone = 'accent' | 'danger' | 'primary';

type ItemDef = {
  key: 'track' | 'returns' | 'help';
  href: string;
  tone: Tone;
  icon: LucideIcon;
  title: string;
  desc: string;
  cta: string;
};

const TONE_VARS: Record<Tone, { color: string; on: string }> = {
  accent: { color: 'var(--color-accent)', on: 'var(--color-on-accent)' },
  danger: { color: 'var(--color-danger)', on: 'var(--color-on-danger)' },
  primary: { color: 'var(--color-primary)', on: 'var(--color-on-primary)' },
};

type ToneVars = CSSProperties & Record<'--qa-color' | '--qa-on', string>;
const makeToneStyle = (tone: Tone): ToneVars => ({
  ['--qa-color']: TONE_VARS[tone].color,
  ['--qa-on']: TONE_VARS[tone].on,
});

export function QuickActions() {
  const { t: tSupport } = useTranslation('support');

  const items = useMemo<ItemDef[]>(
    () => [
      {
        key: 'track',
        href: tSupport('links.tracking.href') || '#tracking',
        tone: 'accent',
        icon: Search,
        title: tSupport('quickActions.track.title'),
        desc: tSupport('quickActions.track.desc'),
        cta: tSupport('quickActions.track.cta'),
      },
      {
        key: 'returns',
        href: tSupport('links.returns.href') || '#returns',
        tone: 'danger',
        icon: RefreshCw,
        title: tSupport('quickActions.returns.title'),
        desc: tSupport('quickActions.returns.desc'),
        cta: tSupport('quickActions.returns.cta'),
      },
      {
        key: 'help',
        href: tSupport('links.faq.href') || '#faq',
        tone: 'primary',
        icon: HelpCircle,
        title: tSupport('quickActions.help.title'),
        desc: tSupport('quickActions.help.desc'),
        cta: tSupport('quickActions.help.cta'),
      },
    ],
    [tSupport],
  );

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-on-surface)]">
          {tSupport('quickActions.title')}
        </h2>
        <p className="text-lg text-[color:var(--color-muted)] max-w-xl mx-auto leading-relaxed">
          {tSupport('quickActions.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(({ key, href, tone, icon: Icon, title, desc, cta }) => {
          const toneStyle = makeToneStyle(tone);
          return (
            <div
              key={key}
              className="group hover:shadow-lg transition-all duration-300 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl h-full"
            >
              <div className="p-6 flex h-full flex-col text-center space-y-4">
                <div
                  style={toneStyle}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto transition-colors bg-[color:var(--qa-color)]/10 group-hover:bg-[color:var(--qa-color)]/20"
                >
                  <Icon className="w-6 h-6 text-[color:var(--qa-color)]" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-lg text-[color:var(--color-on-surface)]">
                    {title}
                  </h3>
                  <p className="text-sm text-[color:var(--color-muted)]">{desc}</p>
                </div>

                <div className="mt-auto">
                  <Button
                    style={toneStyle}
                    className="w-full bg-[color:var(--qa-color)] text-[color:var(--qa-on)] hover:bg-[color:var(--qa-color)]/90"
                  >
                    <a href={href}>{cta}</a>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
