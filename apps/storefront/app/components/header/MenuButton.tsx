import { IconButton } from '@nuvens/ui-core';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAside } from '~/components/Aside';

export function MenuButton() {
  const { open } = useAside();
  const { t } = useTranslation('common');
  const label = t('nav.menu', 'Menu');
  const openLabel = t('nav.openMenu', 'Open menu');

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={150}>
        <Tooltip.Trigger asChild>
          <IconButton aria-label={openLabel} onClick={() => open('mobile')}>
            <Menu className="h-5 w-5" />
          </IconButton>
        </Tooltip.Trigger>
        <Tooltip.Content
          sideOffset={8}
          className="z-50 rounded-lg bg-[color:var(--color-popover,#111)] text-[color:var(--color-on-popover,#fff)] px-2 py-1 text-xs shadow-md"
        >
          {label}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
