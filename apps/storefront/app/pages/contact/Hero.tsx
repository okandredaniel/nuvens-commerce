import { Badge, Button } from '@nuvens/ui';
import { Headphones, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="relative overflow-hidden bg-neutral-0">
      <div className="mx-auto w-full max-w-[88rem] px-4 py-12 md:px-6 md:py-16">
        <div className="space-y-8 text-center">
          <Badge>
            <Headphones className="h-4 w-4" />
            {tSupport('hero.badge')}
          </Badge>

          <h1 className="text-5xl font-bold leading-tight tracking-tight text-neutral-950 md:text-7xl">
            {tSupport('hero.title')}
          </h1>

          <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-600 md:text-2xl">
            {tSupport('hero.subtitle')}
          </p>

          <div className="mx-auto mt-12 flex max-w-md flex-col justify-center gap-6 sm:max-w-none sm:flex-row">
            <Button asChild size="md">
              <a href={tSupport('channels.chat.href') || '#chat'}>
                <MessageCircle className="mr-3 h-5 w-5" />
                {tSupport('channels.actions.openChat')}
              </a>
            </Button>
            <Button asChild size="md" variant="outline">
              <a href={tSupport('channels.phone.href') || '#phone'}>
                <Phone className="mr-3 h-5 w-5" />
                {tSupport('channels.actions.callUs')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
