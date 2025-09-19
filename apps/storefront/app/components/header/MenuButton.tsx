import { IconButton, Tooltip, useAside } from '@nuvens/ui';
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
        <IconButton aria-label={openLabel} onClick={() => open('mobile')} variant="outline">
          <Menu className="h-5 w-5" />
        </IconButton>
      </Tooltip.Trigger>
      <Tooltip.Content sideOffset={8}>
        {label}
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
