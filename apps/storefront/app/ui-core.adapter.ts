import { setCoreAdapter } from '@nuvens/ui-core';
import { LocalizedLink } from '~/components/LocalizedLink';
import { LocalizedNavLink } from '~/components/LocalizedNavLink';

export function registerUiCoreAdapter() {
  setCoreAdapter({
    Link: LocalizedLink as any,
    NavLink: LocalizedNavLink as any,
  });
}
