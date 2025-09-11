import { Button } from '@nuvens/ui';
import { Mail, MessageCircle, MessageSquare, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ChannelKey = 'chat' | 'whatsapp' | 'email' | 'phone';

const ICON_BY_KEY: Record<ChannelKey, React.ComponentType<{ className?: string }>> = {
  chat: MessageCircle,
  whatsapp: MessageSquare,
  email: Mail,
  phone: Phone,
};

const VARIANT_BY_KEY: Record<ChannelKey, 'primary' | 'outline' | 'ghost'> = {
  chat: 'primary',
  whatsapp: 'outline',
  email: 'outline',
  phone: 'outline',
};

const ACTION_BY_KEY: Record<ChannelKey, 'openChat' | 'openWhatsApp' | 'emailUs' | 'callUs'> = {
  chat: 'openChat',
  whatsapp: 'openWhatsApp',
  email: 'emailUs',
  phone: 'callUs',
};

export function ChannelsGrid() {
  const { t: tSupport } = useTranslation('support');

  const items: { key: ChannelKey; href: string }[] = [
    { key: 'chat', href: tSupport('channels.chat.href') || '#chat' },
    { key: 'whatsapp', href: tSupport('channels.whatsapp.href') || '#whatsapp' },
    { key: 'email', href: tSupport('channels.email.href') || 'mailto:hello@example.com' },
    { key: 'phone', href: tSupport('channels.phone.href') || 'tel:+1234567890' },
  ];

  return (
    <section>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[color:var(--color-on-surface)]">
          {tSupport('channels.title')}
        </h2>
        <p className="text-xl text-[color:var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
          {tSupport('channels.subtitle')}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {items.map(({ key, href }) => {
          const Icon = ICON_BY_KEY[key];
          const variant = VARIANT_BY_KEY[key];
          const actionKey = ACTION_BY_KEY[key];
          const label = tSupport(`channels.actions.${actionKey}`);

          return (
            <div
              key={key}
              className="flex flex-col p-8 space-y-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] rounded-2xl"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-2xl bg-[color:var(--color-primary)]/10">
                  <Icon className="w-10 h-10 text-[color:var(--color-primary)]" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-xl text-[color:var(--color-on-surface)]">
                  {tSupport(`channels.${key}.title`)}
                </h3>
                <p className="text-[color:var(--color-muted)] leading-relaxed">
                  {tSupport(`channels.${key}.desc`)}
                </p>
              </div>

              <Button
                variant={variant as any}
                className="w-full py-3 text-base font-medium mt-auto"
              >
                <a
                  href={href}
                  target={key === 'whatsapp' ? '_blank' : undefined}
                  rel={key === 'whatsapp' ? 'noopener noreferrer' : undefined}
                >
                  {label}
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
