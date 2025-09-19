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
    { key: 'chat', href: tSupport('channels.chat.href') },
    { key: 'whatsapp', href: tSupport('channels.whatsapp.href') },
    { key: 'email', href: tSupport('channels.email.href') },
    { key: 'phone', href: tSupport('channels.phone.href') },
  ];

  return (
    <section>
      <div className="mb-16 text-center">
        <h2 className="mb-6 text-4xl font-bold text-neutral-950 md:text-5xl">
          {tSupport('channels.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-600">
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
              className="flex flex-col rounded-2xl border border-neutral-200 bg-neutral-0 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex justify-center">
                <div className="rounded-2xl bg-primary-600/10 p-4">
                  <Icon className="h-10 w-10 text-primary-600" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-neutral-950">
                  {tSupport(`channels.${key}.title`)}
                </h3>
                <p className="leading-relaxed text-neutral-600">
                  {tSupport(`channels.${key}.desc`)}
                </p>
              </div>

              <Button
                asChild
                variant={variant}
                className="mt-auto w-full py-3 text-base font-medium"
              >
                <a
                  href={href}
                  aria-label={label}
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
