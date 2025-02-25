import { ICartByBrand, ICartItem } from '@/types/cart'
import { DiscountTypeEnum, ProductDiscountEnum, VoucherApplyTypeEnum } from '@/types/enum'
import { DiscountType } from '@/types/product-discount'
import { TVoucher } from '@/types/voucher'

/**
 * Calculates the price after applying a discount.
 * Handles cases where discount or discountType are optional, null, or zero.
 *
 * @param price - The original price of the product.
 * @param discount - The discount value (optional).
 * @param discountType - The type of discount (optional, 'percentage' or 'amount').
 * @returns The discounted price.
 */
export const calculateDiscountPrice = (
  price: number,
  discount?: number | null,
  discountType?: DiscountType | null,
): number => {
  if (!discount || !discountType || discount === 0) {
    return price
  }

  let discountedPrice = price

  if (discountType === DiscountTypeEnum.PERCENTAGE) {
    discountedPrice -= price * discount
  } else if (discountType === DiscountTypeEnum.AMOUNT) {
    discountedPrice -= discount
  }

  // Ensure the price is not negative
  return Math.max(discountedPrice, 0)
}
/**
 * Calculates the discount amount based on the given price and discount percentage.
 *
 * @param price - The original price of the product.
 * @param discount - The discount value (optional).
 * @param discountType - The type of discount ('percentage' or 'amount', optional).
 * @returns The final discounted price.
 */
export const calculateDiscountAmount = (
  price: number,
  discount?: number | null,
  discountType?: DiscountType | null,
): number => {
  if (!discount || !discountType) {
    return price
  }

  let discountedPrice = 0

  if (discountType === DiscountTypeEnum.PERCENTAGE) {
    console.log(price * discount)
    discountedPrice = price * discount
  } else if (discountType === DiscountTypeEnum.AMOUNT) {
    discountedPrice = discount
  }

  // Ensure the price is not negative
  return Math.max(discountedPrice, 0)
}

/**
 * Calculates the total price of a product based on discount type and quantity.
 * @param discount - The discount value.
 * @param discountType - The type of discount (percentage or amount).
 * @param price - The original price of the product.
 * @param quantity - The quantity of the product.
 * @returns The total price after applying the discount.
 */
export const calculateTotalPrice = (
  price: number,
  quantity: number,
  discount?: number | null,
  discountType?: DiscountType | null,
): number => {
  const discountedPrice = calculateDiscountPrice(price, discount, discountType)
  return discountedPrice * quantity
}

/**
 * Calculates the total price for all selected cart items.
 * @param selectedCartItems - Array of selected cart item IDs.
 * @param cartByBrand - Cart data grouped by brand.
 * @returns The total price for selected items.
 */
export const getTotalPrice = (selectedCartItems: string[], cartByBrand?: ICartByBrand): number => {
  if (!cartByBrand) return 0

  let total = 0

  selectedCartItems?.forEach((itemId) => {
    Object?.values(cartByBrand)?.forEach((cartBrand) => {
      const cartItem = cartBrand?.find((item) => item?.id === itemId)
      if (cartItem) {
        const productPrice = cartItem?.productClassification?.price ?? 0
        const discount = cartItem?.productClassification?.productDiscount?.discount ?? 0
        const discountType = DiscountTypeEnum.PERCENTAGE
        const cartItemQuantity = cartItem?.quantity ?? 0

        total += calculateTotalPrice(productPrice, cartItemQuantity, discount, discountType)
      }
    })
  })

  return total
}
/**
 * Calculates the original total price for all selected cart items.
 * @param selectedCartItems - Array of selected cart item IDs.
 * @param cartByBrand - Cart data grouped by brand.
 * @returns The total price for selected items.
 */
export const getOriginalTotalPrice = (selectedCartItems: string[], cartByBrand?: ICartByBrand): number => {
  if (!cartByBrand) return 0

  let total = 0

  selectedCartItems?.forEach((itemId) => {
    Object?.values(cartByBrand)?.forEach((cartBrand) => {
      const cartItem = cartBrand?.find((item) => item?.id === itemId)
      if (cartItem) {
        const productPrice = cartItem?.productClassification?.price ?? 0
        const cartItemQuantity = cartItem?.quantity ?? 0

        total += calculateTotalPrice(productPrice, cartItemQuantity)
      }
    })
  })

  return total
}

/**
 * Calculates the total price that direct discounted from products for all selected cart items.
 * @param selectedCartItems - Array of selected cart item IDs.
 * @param cartByBrand - Cart data grouped by brand.
 * @returns The total price for selected items.
 */
export const calculateTotalProductDiscount = (selectedCartItems: string[], cartByBrand?: ICartByBrand): number => {
  if (!cartByBrand) return 0

  let totalDiscount = 0

  selectedCartItems?.forEach((itemId) => {
    Object?.values(cartByBrand)?.forEach((cartBrand) => {
      const cartItem = cartBrand?.find((item) => item?.id === itemId)
      if (cartItem) {
        const productPrice = cartItem?.productClassification?.price ?? 0
        const cartItemQuantity = cartItem?.quantity ?? 0
        const discount = cartItem?.productClassification?.productDiscount?.discount ?? 0
        const discountType = DiscountTypeEnum.PERCENTAGE
        if (discount && discount > 0) {
          totalDiscount += calculateDiscountAmount(productPrice, discount, discountType) * cartItemQuantity
        }
      }
    })
  })

  return totalDiscount
}

/**
 * Calculates total product cost, total product discount, and total price after discount for all selected cart items.
 *
 * @param selectedCartItems - Array of selected cart item IDs.
 * @param cartByBrand - Cart data grouped by brand.
 * @returns An object containing totalProductCost, totalProductDiscount, and totalPrice.
 */
export const calculateCartTotals = (
  selectedCartItems: string[],
  cartByBrand?: ICartByBrand | null,
): {
  totalProductCost: number
  totalProductDiscount: number
  totalPrice: number
} => {
  if (!cartByBrand) return { totalProductCost: 0, totalProductDiscount: 0, totalPrice: 0 }

  let totalProductCost = 0
  let totalProductDiscount = 0
  let totalPrice = 0

  selectedCartItems?.forEach((itemId) => {
    Object?.values(cartByBrand)?.forEach((cartBrand) => {
      const cartItem = cartBrand?.find((item) => item?.id === itemId)
      if (cartItem) {
        const productPrice = cartItem?.productClassification?.price ?? 0
        const cartItemQuantity = cartItem?.quantity ?? 0
        const discount =
          cartItem?.productClassification?.productDiscount &&
          cartItem?.productClassification?.productDiscount?.status === ProductDiscountEnum.ACTIVE
            ? cartItem?.productClassification?.productDiscount?.discount
            : 0
        const discountType = DiscountTypeEnum.PERCENTAGE

        // Calculate total product cost (price without discount)
        const itemTotalCost = productPrice * cartItemQuantity
        totalProductCost += itemTotalCost

        // Calculate total discount amount for the product
        if (discount && discount > 0) {
          const discountAmount = calculateDiscountAmount(productPrice, discount, discountType)
          const itemTotalDiscount = discountAmount * cartItemQuantity
          totalProductDiscount += itemTotalDiscount
        }

        // Calculate total price after applying discount
        const discountedPrice = calculateDiscountPrice(productPrice, discount, discountType)
        const itemTotalPrice = discountedPrice * cartItemQuantity
        totalPrice += itemTotalPrice
      }
    })
  })

  return {
    totalProductCost,
    totalProductDiscount,
    totalPrice,
  }
}

/**
 * Calculates total voucher discount by brand.
 *
 * @param cartItems - selected products
 * @param chosenVouchersByBrand - voucher that user selected from brand voucher list.
 * @param totalPrice - price of product after direct discount in that product.
 * @returns An object show total brands voucher discount of selected products.
 */
// export const calculateTotalVoucherDiscount = (
//   cartItems: ICartByBrand,
//   chosenVouchersByBrand: { [brandId: string]: TVoucher | null },
// ) => {
//   return Object.values(chosenVouchersByBrand).reduce((total, voucher) => {
//     if (!voucher) return total
//     const { discountType, discountValue, maxDiscount, discount, applyProducts, applyType, minOrderValue } = voucher
//     const voucherDiscount = discountType === DiscountTypeEnum.PERCENTAGE ? (discount ?? 0) : discountValue

//     return maxDiscount && maxDiscount > 0
//       ? total + voucherDiscount > maxDiscount
//         ? maxDiscount
//         : total + voucherDiscount
//       : total + voucherDiscount
//   }, 0)
// }

/**
 * Calculates total voucher discount by platform.
 *
 * @param platformChosenVoucher - voucher that user selected from platform voucher list.
 * @param totalPrice - price of product after direct discount in that product.
 * @returns An object show total platform voucher discount of selected products.
 */
// export const calculatePlatformVoucherDiscount = (platformChosenVoucher: TVoucher | null) => {
//   if (!platformChosenVoucher) return 0

//   const { discountType, discountValue, maxDiscount, discount } = platformChosenVoucher
//   const voucherValue = discountType === DiscountTypeEnum.PERCENTAGE ? (discount ?? 0) : discountValue
//   return maxDiscount && maxDiscount > 0 ? (voucherValue > maxDiscount ? maxDiscount : voucherValue) : voucherValue
// }
// export const calculatePlatformVoucherDiscount = (
//   cartItems: ICartByBrand,
//   selectedCartItems: string[],
//   platformChosenVoucher: TVoucher | null,
//   chosenVouchersByBrand: { [brandId: string]: TVoucher | null },
// ): number => {
//   if (!platformChosenVoucher || selectedCartItems.length === 0) return 0

//   const { applyType, applyProducts, discountType, discountValue, minOrderValue, maxDiscount } = platformChosenVoucher
//   const applyProductIds = applyProducts?.map((p) => p.id) ?? []

//   // Calculate total price after brand voucher discounts
//   const totalPriceAfterBrandDiscount = Object.keys(cartItems).reduce((total, brandName) => {
//     const brandItems = cartItems[brandName]
//     const brandId =
//       (
//         brandItems[0]?.productClassification?.productDiscount?.product ??
//         brandItems[0]?.productClassification?.preOrderProduct?.product ??
//         brandItems[0]?.productClassification?.product
//       )?.brand?.id ?? ''
//     const brandVoucher = chosenVouchersByBrand[brandId] || null

//     // Price before platform discount, but after brand discount
//     const priceAfterBrandDiscount = brandItems.reduce((subtotal, cartItem) => {
//       if (!selectedCartItems.includes(cartItem.id)) return subtotal

//       const productClassification = cartItem.productClassification
//       const discount = productClassification?.productDiscount?.discount ?? 0
//       const discountType = discount > 0 ? DiscountTypeEnum.PERCENTAGE : null
//       const basePrice = calculateTotalPrice(productClassification.price, cartItem.quantity, discount, discountType)
//       const brandDiscount = calculateBrandVoucherDiscount(brandItems, selectedCartItems, brandVoucher)

//       return subtotal + basePrice - brandDiscount
//     }, 0)

//     return total + priceAfterBrandDiscount
//   }, 0)

//   if (totalPriceAfterBrandDiscount < minOrderValue) return 0

//   const discountVoucherValue =
//     discountType === DiscountTypeEnum.PERCENTAGE ? discountValue * totalPriceAfterBrandDiscount : discountValue

//   return Math.min(discountVoucherValue, maxDiscount)
// }

/**
 * Calculates the total price for all selected cart items.
 * @param selectedCartItems - Array of selected cart item IDs.
 * @param cartByBrand - Cart data grouped by brand.
 * @returns The total price for selected items.
 */
export const getTotalBrandProductsPrice = (cartBrandItem?: ICartItem[]): number => {
  if (!cartBrandItem || cartBrandItem?.length === 0) return 0

  let total = 0

  cartBrandItem?.forEach((cartBrand) => {
    if (cartBrand) {
      const productPrice = cartBrand?.productClassification?.price ?? 0
      const discount = cartBrand?.productClassification?.productDiscount?.discount ?? 0
      const discountType = DiscountTypeEnum.PERCENTAGE
      const cartItemQuantity = cartBrand?.quantity ?? 0

      total += calculateTotalPrice(productPrice, cartItemQuantity, discount, discountType)
    }
  })

  return total
}

/**
 * Calculate the discounted price based on the current price and discount percentage.
 *
 * @param currentPrice - The original price of the product.
 * @param discountPercent - The discount percentage to apply (0-100).
 * @returns The discounted price, rounded to two decimal places.
 */
export function calculateDiscountedPrice(currentPrice: number, discountPercent: number): number {
  if (currentPrice < 0) {
    throw new Error('Current price must be a non-negative number.')
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100.')
  }

  const discountAmount = (currentPrice * discountPercent) / 100
  const discountedPrice = currentPrice - discountAmount

  return parseFloat(discountedPrice.toFixed(2))
}

/**
 * Calculate the discounted voucher price of products in one brand that user selected.
 *
 * @param cartBrandItem - List of cart items for a specific brand.
 * @param selectedCartItems - IDs of the cart items selected for checkout.
 * @param voucher - The voucher being applied to this brand's items.
 * @returns The discounted voucher price.
 */
export const calculateBrandVoucherDiscount = (
  cartBrandItem: ICartItem[],
  selectedCartItems: string[],
  voucher: TVoucher | null,
): number => {
  if (!voucher || selectedCartItems.length === 0) return 0

  const { applyType, applyProducts, discountType, discountValue, minOrderValue, maxDiscount } = voucher
  const applyProductIds = applyProducts ? applyProducts.map((p) => p.id) : []

  // Calculate total price of products in brand that available apply discount
  const totalProductPrice = cartBrandItem.reduce((total, cartItem) => {
    const product =
      cartItem?.productClassification?.productDiscount?.product ??
      cartItem?.productClassification?.preOrderProduct?.product ??
      cartItem?.productClassification?.product

    if (
      applyType === VoucherApplyTypeEnum.SPECIFIC &&
      applyProductIds.length > 0 &&
      !applyProductIds.includes(product.id)
    ) {
      return total
    }

    if (!selectedCartItems.includes(cartItem.id)) return total

    const productClassification = cartItem.productClassification
    const discount = productClassification?.productDiscount?.discount ?? 0
    const productDiscountType = discount > 0 ? DiscountTypeEnum.PERCENTAGE : null

    return total + calculateTotalPrice(productClassification.price, cartItem.quantity, discount, productDiscountType)
  }, 0)

  if (totalProductPrice < minOrderValue) return 0

  const discountVoucherValue =
    discountType === DiscountTypeEnum.PERCENTAGE ? discountValue * totalProductPrice : discountValue

  console.log('totalProductPrice', totalProductPrice)
  console.log('discountValue', discountValue)
  console.log('discountVoucherValue', discountVoucherValue)
  console.log('finalValue', Math.min(discountVoucherValue, maxDiscount))
  return Math.min(discountVoucherValue, maxDiscount)
}
/**
 * Calculate the discounted voucher price of products in one brand that user selected.
 *
 * @param checkoutBrandItem - List of cart items for a specific brand.
 * @param voucher - The voucher being applied to this brand's items.
 * @returns The discounted voucher price.
 */
export const calculateCheckoutBrandVoucherDiscount = (
  checkoutBrandItem: ICartItem[],
  voucher: TVoucher | null,
): number => {
  if (!voucher || checkoutBrandItem.length === 0) return 0

  const { applyType, applyProducts, discountType, discountValue, minOrderValue, maxDiscount } = voucher
  const applyProductIds = applyProducts ? applyProducts.map((p) => p.id) : []

  // Calculate total price of products in brand that available apply discount
  const totalProductPrice = checkoutBrandItem.reduce((total, cartItem) => {
    const product =
      cartItem?.productClassification?.productDiscount?.product ??
      cartItem?.productClassification?.preOrderProduct?.product ??
      cartItem?.productClassification?.product

    if (
      applyType === VoucherApplyTypeEnum.SPECIFIC &&
      applyProductIds.length > 0 &&
      !applyProductIds.includes(product.id)
    ) {
      return total
    }

    const productClassification = cartItem.productClassification
    const discount = productClassification?.productDiscount?.discount ?? 0
    const productDiscountType = discount > 0 ? DiscountTypeEnum.PERCENTAGE : null

    return total + calculateTotalPrice(productClassification.price, cartItem.quantity, discount, productDiscountType)
  }, 0)

  if (totalProductPrice < minOrderValue) return 0

  const discountVoucherValue =
    discountType === DiscountTypeEnum.PERCENTAGE ? discountValue * totalProductPrice : discountValue

  console.log('totalProductPrice', totalProductPrice)
  console.log('discountValue', discountValue)
  console.log('discountVoucherValue', discountVoucherValue)
  console.log('finalValue', Math.min(discountVoucherValue, maxDiscount))
  return Math.min(discountVoucherValue, maxDiscount)
}

/**
 * Calculate the total discounted voucher price of products in one brand that user selected.
 *
 * @param cartItems - All items in cart.
 * @param selectedCartItems - List of id that user selected.
 * @param voucher - The voucher selected.
 * @returns The discounted voucher price.
 */
export const calculateTotalBrandVoucherDiscount = (
  cartItems: ICartByBrand | null,
  selectedCartItems: string[],
  chosenVouchersByBrand: { [brandId: string]: TVoucher | null },
): number => {
  if (!cartItems) return 0
  return Object.keys(cartItems).reduce((totalDiscount, brandName) => {
    const brandItems = cartItems[brandName]
    const brandId = brandItems[0]?.productClassification?.product?.brand?.id ?? ''
    const brandVoucher = chosenVouchersByBrand[brandId] || null

    return totalDiscount + calculateBrandVoucherDiscount(brandItems, selectedCartItems, brandVoucher)
  }, 0)
}
/**
 * Calculate the total discounted voucher price of products in one brand that user selected.
 *
 * @param voucher - The voucher selected.
 * @returns The discounted voucher price.
 */
export const calculateTotalCheckoutBrandVoucherDiscount = (chosenVouchersByBrand: {
  [brandId: string]: TVoucher | null
}): number => {
  return Object.values(chosenVouchersByBrand).reduce((total, voucher) => {
    return total + (voucher?.discount ?? 0)
  }, 0)
}

// /**
//  * Calculate the total discounted voucher price of products in one brand that user selected.
//  *
//  * @param checkoutItems - All items in cart.
//  * @param voucher - The voucher selected.
//  * @returns The discounted voucher price.
//  */
// export const calculateTotalCheckoutBrandVoucherDiscount = (
//   checkoutItems: ICartByBrand | null,
//   chosenVouchersByBrand: { [brandId: string]: TVoucher | null },
// ): number => {
//   if (!checkoutItems) return 0
//   return Object.keys(checkoutItems).reduce((totalDiscount, brandName) => {
//     const brandItems = checkoutItems[brandName]
//     const brandId = brandItems[0]?.productClassification?.product?.brand?.id ?? ''
//     const brandVoucher = chosenVouchersByBrand[brandId] || null

//     return totalDiscount + calculateCheckoutBrandVoucherDiscount(brandItems, brandVoucher)
//   }, 0)
// }

/**
 * Calculate the platform voucher discount applied to the entire order.
 *
 * @param cartItems - List of all cart items across different shops.
 * @param selectedCartItems - IDs of the cart items selected for checkout.
 * @param voucher - The platform voucher being applied.
 * @returns The total discount from the platform voucher.
 */
export const calculatePlatformVoucherDiscount = (
  cartItems: ICartByBrand | null,
  selectedCartItems: string[],
  voucher: TVoucher | null,
): number => {
  if (!voucher || !cartItems || selectedCartItems.length === 0) return 0

  const { applyType, applyProducts, discountType, discountValue, minOrderValue, maxDiscount } = voucher
  const applyProductIds = applyProducts ? applyProducts.map((p) => p.id) : []

  // Flatten all items across brands
  const allCartItems = Object.values(cartItems).flatMap((items) => items)

  // Get total price of selected items eligible for the platform voucher
  const totalOrderPrice = allCartItems.reduce((total, cartItem) => {
    const product =
      cartItem?.productClassification?.productDiscount?.product ??
      cartItem?.productClassification?.preOrderProduct?.product ??
      cartItem?.productClassification?.product

    if (
      applyType === VoucherApplyTypeEnum.SPECIFIC &&
      applyProductIds.length > 0 &&
      !applyProductIds.includes(product.id)
    ) {
      return total
    }

    if (!selectedCartItems.includes(cartItem.id)) return total

    const productClassification = cartItem.productClassification
    const discount = productClassification?.productDiscount?.discount ?? 0
    const productDiscountType = discount > 0 ? DiscountTypeEnum.PERCENTAGE : null

    return total + calculateTotalPrice(productClassification.price, cartItem.quantity, discount, productDiscountType)
  }, 0)

  if (totalOrderPrice < minOrderValue) return 0

  // Calculate the voucher discount amount
  const discountVoucherValue =
    discountType === DiscountTypeEnum.PERCENTAGE ? totalOrderPrice * discountValue : discountValue

  return Math.min(discountVoucherValue, maxDiscount)
}
