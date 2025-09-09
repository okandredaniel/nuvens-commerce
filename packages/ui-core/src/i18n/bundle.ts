import type { Language } from './config';

export type BundleResources = Partial<Record<Language, Record<string, string>>>;

export interface I18nBundle {
  ns: string;
  resources: BundleResources;
}
