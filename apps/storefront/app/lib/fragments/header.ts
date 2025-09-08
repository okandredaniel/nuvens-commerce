import { MENU_FRAGMENT } from './menu';

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain { url }
    brand {
      logo {
        image { url }
      }
    }
  }

  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop { ...Shop }
    menu(handle: $headerMenuHandle) { ...Menu }
  }
  ${MENU_FRAGMENT}
` as const;
