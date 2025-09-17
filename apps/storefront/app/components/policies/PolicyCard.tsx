import { LocalizedLink } from '@/components/LocalizedLink';
import { Card, CardContent } from '@nuvens/ui';
import { FileText, RotateCcw, ScrollText, Shield, Truck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PolicyItem = { id: string; title: string; handle: string };

const ICONS: Record<string, React.ComponentType<any>> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'privacy-policy': Shield,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'shipping-policy': Truck,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'refund-policy': RotateCcw,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'terms-of-service': ScrollText,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'subscription-policy': FileText,
};

export function PolicyCard({ policy }: { policy: PolicyItem }) {
  const { t } = useTranslation('policies');
  const Icon = ICONS[policy.handle] ?? FileText;

  return (
    <LocalizedLink
      to={`/policies/${policy.handle}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
    >
      <Card className="transition-all hover:shadow-md hover:-translate-y-[2px]">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[color:var(--color-primary)]/10">
              <Icon className="h-5 w-5 text-[color:var(--color-primary)]" />
            </div>
            <div>
              <h2 className="text-base font-medium text-[color:var(--color-on-surface)] group-hover:underline">
                {policy.title}
              </h2>
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">
                {t('cards.read', { title: policy.title.toLowerCase() })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
