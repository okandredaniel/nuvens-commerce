import { Language } from '@nuvens/core';
import { toLang } from './localize';

export function getEffectiveLang(defaultLocale: Language, data: any): string {
  const base = data?.i18n?.locale ?? data?.consent?.language ?? defaultLocale;
  return toLang(base);
}
