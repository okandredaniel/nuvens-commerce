import { brandResources } from './locales';

export * from './config';
export * from './locales';

export const brandI18n = {
  resources: brandResources,
} as const;
