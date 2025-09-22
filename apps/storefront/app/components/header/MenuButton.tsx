import { Button, Tooltip, useAside } from '@nuvens/ui';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function MenuButton() {
  const { open } = useAside();
  const { t } = useTranslation('common');
  const label = t('nav.menu');
  const openLabel = t('nav.openMenu');

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Button
          aria-label={openLabel}
          onClick={() => open('mobile')}
          variant="outline"
          surface="dark"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={8}>
        {label}
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
