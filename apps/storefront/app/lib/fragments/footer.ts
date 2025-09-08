import { MENU_FRAGMENT } from './menu';

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) { ...Menu }
  }
  ${MENU_FRAGMENT}
` as const;
