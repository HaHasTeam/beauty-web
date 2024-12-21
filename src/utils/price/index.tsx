import { ICartByBrand } from '@/types/cart'
import { DiscountTypeEnum } from '@/types/enum'
import { DiscountType } from '@/types/product-discount'

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
    discountedPrice -= (price * discount) / 100
  } else if (discountType === DiscountTypeEnum.AMOUNT) {
    discountedPrice -= discount
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
        const discountType = (cartItem?.productClassification?.productDiscount?.discountType as DiscountType) ?? ''
        const cartItemQuantity = cartItem?.quantity ?? 0

        total += calculateTotalPrice(productPrice, cartItemQuantity, discount, discountType)
      }
    })
  })

  return total
}
