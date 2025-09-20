import { brandDefaultLocale } from '@nuvens/brand-ui';
import { toLang } from './localize';

export function getEffectiveLang(data?: any): string {
  const brandDefault = typeof brandDefaultLocale === 'string' && brandDefaultLocale;
  const base = data?.i18n?.locale ?? data?.consent?.language ?? brandDefault;
  return toLang(base);
}
