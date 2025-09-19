import { LocalizedLink } from '@/components/LocalizedLink';
import { Card, CardContent } from '@nuvens/ui';
import { FileText, RotateCcw, ScrollText, Shield, Truck, type LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type PolicyItem = { id: string; title: string; handle: string };

const ICONS: Record<string, LucideIcon> = {
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
  const handle = (policy.handle || '').toLowerCase();
  const Icon = ICONS[handle] ?? FileText;
  const aria = t('cards.read', { title: policy.title });

  return (
    <LocalizedLink
      to={`/policies/${policy.handle}`}
      aria-label={aria}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-0"
    >
      <Card className="ui-radius transition-transform shadow-sm hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="ui-radius grid h-10 w-10 place-items-center bg-primary-600/10">
              <Icon className="h-5 w-5 text-primary-600" aria-hidden />
            </div>
            <div>
              <h2 className="text-base font-medium text-neutral-900 group-hover:underline">
                {policy.title}
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {t('cards.read', { title: policy.title.toLocaleLowerCase() })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </LocalizedLink>
  );
}
