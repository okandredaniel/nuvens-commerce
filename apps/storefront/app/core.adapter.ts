import { LocalizedLink } from '@/components/LocalizedLink';
import { LocalizedNavLink } from '@/components/LocalizedNavLink';
import { setCoreAdapter } from '@nuvens/core';

export function registerUiCoreAdapter() {
  setCoreAdapter({
    Link: LocalizedLink as any,
    NavLink: LocalizedNavLink as any,
  });
}
