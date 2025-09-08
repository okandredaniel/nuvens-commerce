import { Button } from '@nuvens/ui-core';
import { Headphones, MessageCircle, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t: tSupport } = useTranslation('support');

  return (
    <section className="relative overflow-hidden bg-[color:var(--color-surface)]">
      <div className="mx-auto w-full max-w-[88rem] px-4 md:px-6 py-12 md:py-16">
        <div className="text-center space-y-8">
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-muted)]">
            <Headphones className="w-4 h-4" />
            {tSupport('hero.badge')}
          </span>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-[color:var(--color-on-surface)]">
            {tSupport('hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-[color:var(--color-muted)] max-w-2xl mx-auto leading-relaxed">
            {tSupport('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 max-w-md mx-auto sm:max-w-none">
            <Button asChild size="md">
              <a href={tSupport('channels.chat.href') || '#chat'} className="text-base px-6 py-3">
                <MessageCircle className="w-5 h-5 mr-3" />
                {tSupport('channels.actions.openChat')}
              </a>
            </Button>
            <Button asChild size="md" variant="outline">
              <a href={tSupport('channels.phone.href') || '#phone'} className="text-base px-6 py-3">
                <Phone className="w-5 h-5 mr-3" />
                {tSupport('channels.actions.callUs')}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
