export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }

  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount { ...Money }
      amountPerQuantity { ...Money }
      compareAtAmountPerQuantity { ...Money }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice { ...Money }
        price { ...Money }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }

  fragment CartApiQuery on Cart {
    updatedAt
    id
    checkoutUrl
    totalQuantity
    note

    appliedGiftCards {
      lastCharacters
      amountUsed { ...Money }
    }

    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }

    lines(first: $numCartLines) {
      nodes { ...CartLine }
    }

    cost {
      subtotalAmount { ...Money }
      totalAmount { ...Money }
      totalDutyAmount { ...Money }
      totalTaxAmount { ...Money }
    }

    attributes {
      key
      value
    }

    discountCodes {
      code
      applicable
    }
  }
` as const;
