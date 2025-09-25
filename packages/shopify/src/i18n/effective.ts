import { Language } from '@nuvens/core';
import { getShopifyAdapter } from '../adapter';
import { toLang } from './localize';

export function getEffectiveLang(defaultLocale: Language, data: any): string {
  const brandDefault = getShopifyAdapter().defaultLocale;
  const base =
    data?.i18n?.locale ??
    data?.consent?.language ??
    (typeof brandDefault === 'string' ? brandDefault : defaultLocale);
  return toLang(base);
}
