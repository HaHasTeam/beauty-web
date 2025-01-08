import { ICartByBrand, ICartItem } from '@/types/cart'
import { DiscountTypeEnum } from '@/types/enum'
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
  if (!discount || !discountType) {
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
        const discount = cartItem?.productClassification?.productDiscount?.discount ?? 0
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
 * @param chosenVouchersByBrand - voucher that user selected from brand voucher list.
 * @param totalPrice - price of product after direct discount in that product.
 * @returns An object show total brands voucher discount of selected products.
 */
export const calculateTotalVoucherDiscount = (chosenVouchersByBrand: { [brandId: string]: TVoucher | null }) => {
  return Object.values(chosenVouchersByBrand).reduce((total, voucher) => {
    if (!voucher) return total
    const { discountType, discountValue, maxDiscount, discount } = voucher
    const voucherDiscount = discountType === DiscountTypeEnum.PERCENTAGE ? (discount ?? 0) : discountValue

    return maxDiscount && maxDiscount > 0
      ? total + voucherDiscount > maxDiscount
        ? maxDiscount
        : total + voucherDiscount
      : total + voucherDiscount
  }, 0)
}

/**
 * Calculates total voucher discount by platform.
 *
 * @param platformChosenVoucher - voucher that user selected from platform voucher list.
 * @param totalPrice - price of product after direct discount in that product.
 * @returns An object show total platform voucher discount of selected products.
 */
export const calculatePlatformVoucherDiscount = (platformChosenVoucher: TVoucher | null) => {
  if (!platformChosenVoucher) return 0

  const { discountType, discountValue, maxDiscount, discount } = platformChosenVoucher
  const voucherValue = discountType === DiscountTypeEnum.PERCENTAGE ? (discount ?? 0) : discountValue
  return maxDiscount && maxDiscount > 0 ? (voucherValue > maxDiscount ? maxDiscount : voucherValue) : voucherValue
}

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
