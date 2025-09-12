export const PRODUCT_GALLERY_IMAGE_FRAGMENT = `#graphql
  fragment ProductGalleryImage on Image {
    __typename
    id
    url
    altText
    width
    height
  }
` as const;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    id
    title
    availableForSale
    sku
    image { ...ProductGalleryImage }
    price { amount currencyCode }
    compareAtPrice { amount currencyCode }
    unitPrice { amount currencyCode }
    selectedOptions { name value }
    product { handle title }
  }
  ${PRODUCT_GALLERY_IMAGE_FRAGMENT}
` as const;

export const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    handle
    title
    vendor
    descriptionHtml
    description
    seo { title description }

    # Required by Hydrogen's getProductOptions
    encodedVariantExistence
    encodedVariantAvailability

    options {
      name
      optionValues {
        name
        firstSelectableVariant { ...ProductVariant }
        swatch {
          color
          image { previewImage { url } }
        }
      }
    }

    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) { ...ProductVariant }

    adjacentVariants(selectedOptions: $selectedOptions) { ...ProductVariant }

    images(first: 20) {
      nodes { ...ProductGalleryImage }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

export const PRODUCT_QUERY = `#graphql
  query Product(
    $handle: String!
    $selectedOptions: [SelectedOptionInput!]!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) { ...Product }
  }
  ${PRODUCT_FRAGMENT}
` as const;
