export enum Language {
  English = 'en',
  French = 'fr',
  Italian = 'it',
  Portuguese = 'pt',
  Spanish = 'es',
}

export type Resources = Record<string, Record<string, any>>;

export type CountryMap = Record<Language, string>;

export type BundleResources = Partial<Record<Language, Record<string, string>>>;

export interface I18nBundle {
  ns: string;
  resources: BundleResources;
}
