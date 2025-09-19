import { Button } from '@nuvens/ui';
import { HelpCircle, RefreshCw, Search, type LucideIcon } from 'lucide-react';
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

const toneStyles: Record<Tone, { tint: string; tintHover: string; text: string; button: string }> =
  {
    accent: {
      tint: 'bg-accent-600/10',
      tintHover: 'group-hover:bg-accent-600/20',
      text: 'text-accent-600',
      button: 'bg-accent-600 text-white hover:bg-accent-700',
    },
    danger: {
      tint: 'bg-danger-600/10',
      tintHover: 'group-hover:bg-danger-600/20',
      text: 'text-danger-600',
      button: 'bg-danger-600 text-white hover:bg-danger-700',
    },
    primary: {
      tint: 'bg-primary-600/10',
      tintHover: 'group-hover:bg-primary-600/20',
      text: 'text-primary-600',
      button: 'bg-primary-600 text-white hover:bg-primary-700',
    },
  };

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
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-neutral-950 md:text-4xl">
          {tSupport('quickActions.title')}
        </h2>
        <p className="mx-auto max-w-xl text-lg leading-relaxed text-neutral-600">
          {tSupport('quickActions.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map(({ key, href, tone, icon: Icon, title, desc, cta }) => {
          const toneCls = toneStyles[tone];
          return (
            <div
              key={key}
              className="group h-full rounded-2xl border border-neutral-200 bg-white transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex h-full flex-col space-y-4 p-6 text-center">
                <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${toneCls.tint} ${toneCls.tintHover}`}
                >
                  <Icon className={`h-6 w-6 ${toneCls.text}`} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
                  <p className="text-sm text-neutral-600">{desc}</p>
                </div>

                <div className="mt-auto">
                  <Button asChild className={`w-full ${toneCls.button}`}>
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
