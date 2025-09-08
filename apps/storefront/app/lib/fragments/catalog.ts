export const MONEY_FRAGMENT = `#graphql
  fragment MoneyCard on MoneyV2 {
    amount
    currencyCode
  }
` as const;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  ${MONEY_FRAGMENT}
  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice { ...MoneyCard }
      maxVariantPrice { ...MoneyCard }
    }
  }
` as const;

export const COLLECTION_CARD_FRAGMENT = `#graphql
  fragment CollectionCard on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
` as const;
