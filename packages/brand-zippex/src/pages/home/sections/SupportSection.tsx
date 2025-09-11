import { Heading, Link } from '@nuvens/ui-core';
import { Headphones, Mail, MessageSquare, PhoneCall } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const items = [
  {
    icon: Headphones,
    titleKey: 'support.items.0.title',
    bodyKey: 'support.items.0.body',
    ctaKey: 'support.items.0.cta',
    href: '#',
  },
  {
    icon: Mail,
    titleKey: 'support.items.1.title',
    bodyKey: 'support.items.1.body',
    ctaKey: 'support.items.1.cta',
    href: '#',
  },
  {
    icon: MessageSquare,
    titleKey: 'support.items.2.title',
    bodyKey: 'support.items.2.body',
    ctaKey: 'support.items.2.cta',
    href: '#',
  },
  {
    icon: PhoneCall,
    titleKey: 'support.items.3.title',
    bodyKey: 'support.items.3.body',
    ctaKey: 'support.items.3.cta',
    href: '#',
  },
];

export function SupportSection({ headingId }: { headingId: string }) {
  const { t } = useTranslation('home');
  return (
    <div>
      <Heading id={headingId} as="h2" align="center" className="sr-only">
        {t('support.title')}
      </Heading>
      <div className="flex flex-col md:flex-row gap-16 md:gap-8">
        {items.map(({ icon: Icon, titleKey, bodyKey, ctaKey, href }) => (
          <div key={titleKey} className="flex flex-col gap-4 items-center w-full">
            <Icon className="text-slate-400" size={60} strokeWidth={1} aria-hidden />
            <Heading
              as="h3"
              align="center"
              className="text-xl text-[color:var(--color-brand-primary)]"
            >
              {t(titleKey)}
            </Heading>
            <p>{t(bodyKey)}</p>
            <Link to={href} className="mt-auto">
              {t(ctaKey)}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
